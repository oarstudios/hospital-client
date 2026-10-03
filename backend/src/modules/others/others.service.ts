import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

const STORE_PATH = join(process.cwd(), 'uploads', 'others.json');

export type CarouselSlide = {
  desktop: string;
  tablet: string;
  mobile: string;
};

type CarouselVariant = 'desktop' | 'tablet' | 'mobile';

/** Site-wide call-to-action banner, placed into blogs from the editor. */
export type Cta = {
  id: string;
  text: string;
  buttonText: string;
  link: string;
};

export type CtaInput = Omit<Cta, 'id'>;

@Injectable()
export class OthersService {
  private ensureStore() {
    const dir = join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(
        STORE_PATH,
        JSON.stringify({ sheetLink: '', carousel: [] }, null, 2),
      );
    }
  }

  private readRaw() {
    this.ensureStore();
    try {
      const raw = fs.readFileSync(STORE_PATH, 'utf8');
      return JSON.parse(raw);
    } catch {
      return { sheetLink: '', carousel: [] };
    }
  }

  private write(obj: any) {
    this.ensureStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(obj, null, 2));
    return obj;
  }

  private deleteFile(filename?: string) {
    if (!filename) return;
    const filePath = join(process.cwd(), 'uploads', filename);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {
      // ignore
    }
  }

  private assertCarouselNotEmpty(slides: CarouselSlide[]) {
    if (!slides.length) {
      throw new BadRequestException('At least one carousel slide is required.');
    }
  }

  private buildSlideFromFields(byField: Record<string, string>): CarouselSlide {
    const desktop = String(byField.desktop || byField.carousel || '').trim();
    const tablet = String(byField.tablet || '').trim();
    const mobile = String(byField.mobile || '').trim();

    if (!desktop && !tablet && !mobile) {
      throw new BadRequestException(
        'Upload at least one carousel image (desktop, tablet, or mobile).',
      );
    }

    return {
      desktop: desktop || tablet || mobile,
      tablet: tablet || desktop || mobile,
      mobile: mobile || tablet || desktop,
    };
  }

  normalizeSlide(item: unknown): CarouselSlide | null {
    if (typeof item === 'string' && item.trim()) {
      const name = item.trim();
      return { desktop: name, tablet: name, mobile: name };
    }

    if (item && typeof item === 'object') {
      const row = item as Partial<CarouselSlide>;
      const desktop = String(row.desktop || '').trim();
      const tablet = String(row.tablet || desktop).trim();
      const mobile = String(row.mobile || tablet || desktop).trim();
      if (!desktop && !tablet && !mobile) return null;
      return {
        desktop: desktop || tablet || mobile,
        tablet: tablet || desktop || mobile,
        mobile: mobile || tablet || desktop,
      };
    }

    return null;
  }

  normalizeCarousel(raw: unknown): CarouselSlide[] {
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item) => this.normalizeSlide(item))
      .filter((item): item is CarouselSlide => Boolean(item));
  }

  normalizeCtas(raw: unknown): Cta[] {
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((c) => c && typeof c === 'object')
      .map((c: any) => ({
        id: String(c.id ?? '').trim(),
        text: String(c.text ?? '').trim(),
        buttonText: String(c.buttonText ?? '').trim(),
        link: String(c.link ?? '').trim(),
      }))
      .filter((c) => c.id && c.text && c.buttonText);
  }

  private cleanCtaInput(input: Partial<CtaInput>): CtaInput {
    const cta = {
      text: String(input?.text ?? '').trim(),
      buttonText: String(input?.buttonText ?? '').trim(),
      link: String(input?.link ?? '').trim(),
    };
    if (!cta.text || !cta.buttonText || !cta.link) {
      throw new BadRequestException('CTA text, button text and link are required.');
    }
    return cta;
  }

  read() {
    const current = this.readRaw();
    const carousel = this.normalizeCarousel(current.carousel);
    const ctas = this.normalizeCtas(current.ctas);
    return { ...current, carousel, ctas };
  }

  /* ── CTAs ─────────────────────────────────────────────────────────────── */

  addCta(input: Partial<CtaInput>) {
    const cta: Cta = { id: randomUUID(), ...this.cleanCtaInput(input) };
    const current = this.readRaw();
    current.ctas = [...this.normalizeCtas(current.ctas), cta];
    this.write(current);
    return this.read();
  }

  updateCta(id: string, input: Partial<CtaInput>) {
    const current = this.readRaw();
    const ctas = this.normalizeCtas(current.ctas);
    const index = ctas.findIndex((c) => c.id === id);
    if (index === -1) throw new NotFoundException('CTA not found.');

    ctas[index] = { id, ...this.cleanCtaInput(input) };
    current.ctas = ctas;
    this.write(current);
    return this.read();
  }

  removeCta(id: string) {
    const current = this.readRaw();
    const ctas = this.normalizeCtas(current.ctas);
    if (!ctas.some((c) => c.id === id)) throw new NotFoundException('CTA not found.');

    current.ctas = ctas.filter((c) => c.id !== id);
    this.write(current);
    return this.read();
  }

  reorderCtas(ids: unknown) {
    const current = this.readRaw();
    const ctas = this.normalizeCtas(current.ctas);
    if (!Array.isArray(ids)) throw new BadRequestException('CTA order must be a list of ids.');

    const byId = new Map(ctas.map((c) => [c.id, c]));
    const ordered = ids.map((id) => byId.get(String(id))).filter((c): c is Cta => Boolean(c));
    // Keep any CTA missing from the request at the end rather than dropping it
    const rest = ctas.filter((c) => !ordered.includes(c));
    current.ctas = [...ordered, ...rest];
    this.write(current);
    return this.read();
  }

  getAll() {
    return this.read();
  }

  saveSheetLink(sheetLink: string) {
    const current = this.readRaw();
    current.sheetLink = sheetLink;
    return this.write(current);
  }

  /** Legacy bulk upload — each file becomes one slide (same image on all breakpoints). */
  addCarouselFiles(files: Express.Multer.File[]) {
    const names = (files || []).map((f) => f.filename).filter(Boolean);
    if (!names.length) {
      throw new BadRequestException(
        'Upload at least one carousel image (desktop, tablet, or mobile).',
      );
    }

    const current = this.readRaw();
    const slides = this.normalizeCarousel(current.carousel);

    names.forEach((name) => {
      slides.push({ desktop: name, tablet: name, mobile: name });
    });

    current.carousel = slides;
    return this.write(current);
  }

  addCarouselSlide(files: Express.Multer.File[]) {
    const byField: Record<string, string> = {};
    for (const file of files || []) {
      if (file?.fieldname && file?.filename) {
        byField[file.fieldname] = file.filename;
      }
    }

    const slide = this.buildSlideFromFields(byField);

    const current = this.readRaw();
    const slides = this.normalizeCarousel(current.carousel);
    slides.push(slide);
    current.carousel = slides;
    return this.write(current);
  }

  removeCarouselFile(filename: string) {
    const current = this.readRaw();
    const slides = this.normalizeCarousel(current.carousel);
    const nextSlides: CarouselSlide[] = [];

    slides.forEach((slide) => {
      const variants = new Set([slide.desktop, slide.tablet, slide.mobile]);
      if (!variants.has(filename)) {
        nextSlides.push(slide);
        return;
      }

      const updated: CarouselSlide = {
        desktop: slide.desktop === filename ? '' : slide.desktop,
        tablet: slide.tablet === filename ? '' : slide.tablet,
        mobile: slide.mobile === filename ? '' : slide.mobile,
      };

      if (updated.desktop || updated.tablet || updated.mobile) {
        nextSlides.push({
          desktop: updated.desktop || updated.tablet || updated.mobile,
          tablet: updated.tablet || updated.desktop || updated.mobile,
          mobile: updated.mobile || updated.tablet || updated.desktop,
        });
      }

      this.deleteFile(filename);
    });

    current.carousel = nextSlides;
    this.assertCarouselNotEmpty(current.carousel);
    return this.write(current);
  }

  removeCarouselSlide(index: number) {
    const current = this.readRaw();
    const slides = this.normalizeCarousel(current.carousel);
    if (slides.length <= 1) {
      throw new BadRequestException("You can't delete the last carousel slide.");
    }
    if (index < 0 || index >= slides.length) {
      throw new NotFoundException('Carousel slide not found.');
    }

    const [removed] = slides.splice(index, 1);
    this.deleteFile(removed.desktop);
    if (removed.tablet !== removed.desktop) this.deleteFile(removed.tablet);
    if (removed.mobile !== removed.desktop && removed.mobile !== removed.tablet) {
      this.deleteFile(removed.mobile);
    }

    current.carousel = slides;
    return this.write(current);
  }

  reorderCarousel(order: unknown) {
    const current = this.readRaw();
    const existing = this.normalizeCarousel(current.carousel);

    if (!Array.isArray(order) || !order.length) {
      throw new BadRequestException('At least one carousel slide is required.');
    }

    const first = order[0];
    if (typeof first === 'string') {
      current.carousel = this.normalizeCarousel(order);
      this.assertCarouselNotEmpty(current.carousel);
      return this.write(current);
    }

    const byKey = new Map(
      existing.map((slide) => [
        `${slide.desktop}|${slide.tablet}|${slide.mobile}`,
        slide,
      ]),
    );

    const nextSlides = order
      .map((item) => this.normalizeSlide(item))
      .filter((item): item is CarouselSlide => Boolean(item))
      .map((item) => {
        const key = `${item.desktop}|${item.tablet}|${item.mobile}`;
        return byKey.get(key) || item;
      });

    current.carousel = nextSlides.length ? nextSlides : existing;
    this.assertCarouselNotEmpty(current.carousel);
    return this.write(current);
  }

  replaceCarouselFile(oldFilename: string, files: Express.Multer.File[]) {
    const newName = (files || [])[0]?.filename;
    if (!newName) {
      throw new BadRequestException('Replacement image is required.');
    }

    const current = this.readRaw();
    const slides = this.normalizeCarousel(current.carousel);
    let found = false;

    current.carousel = slides.map((slide) => {
      const next = { ...slide };
      (['desktop', 'tablet', 'mobile'] as CarouselVariant[]).forEach((variant) => {
        if (slide[variant] === oldFilename) {
          next[variant] = newName;
          found = true;
        }
      });
      return next;
    });

    if (!found) {
      this.deleteFile(newName);
      throw new NotFoundException('Carousel image not found.');
    }

    this.deleteFile(oldFilename);
    return this.write(current);
  }

  replaceCarouselSlideVariant(
    index: number,
    variant: CarouselVariant,
    files: Express.Multer.File[],
  ) {
    if (!['desktop', 'tablet', 'mobile'].includes(variant)) {
      throw new BadRequestException('Variant must be desktop, tablet, or mobile.');
    }

    const newName = (files || [])[0]?.filename;
    if (!newName) {
      throw new BadRequestException('Replacement image is required.');
    }

    const current = this.readRaw();
    const slides = this.normalizeCarousel(current.carousel);
    const slide = slides[index];
    if (!slide) {
      this.deleteFile(newName);
      throw new NotFoundException('Carousel slide not found.');
    }

    const oldName = slide[variant];
    slide[variant] = newName;
    current.carousel = slides;

    const stillUsed = slides.some(
      (s) => s.desktop === oldName || s.tablet === oldName || s.mobile === oldName,
    );
    if (oldName && !stillUsed) this.deleteFile(oldName);

    this.write(current);
    return this.read();
  }
}
