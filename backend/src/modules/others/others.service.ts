import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

const STORE_PATH = join(process.cwd(), 'uploads', 'others.json');

@Injectable()
export class OthersService {
  private ensureStore() {
    const dir = join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(STORE_PATH)) fs.writeFileSync(STORE_PATH, JSON.stringify({ sheetLink: '', carousel: [] }, null, 2));
  }

  read() {
    this.ensureStore();
    try {
      const raw = fs.readFileSync(STORE_PATH, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      return { sheetLink: '', carousel: [] };
    }
  }

  write(obj: any) {
    this.ensureStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(obj, null, 2));
    return obj;
  }

  getAll() {
    return this.read();
  }

  saveSheetLink(sheetLink: string) {
    const current = this.read();
    current.sheetLink = sheetLink;
    return this.write(current);
  }

  addCarouselFiles(files: Express.Multer.File[]) {
    const current = this.read();
    const existing = current.carousel || [];
    const names = (files || []).map((f) => f.filename);
    current.carousel = existing.concat(names);
    return this.write(current);
  }

  removeCarouselFile(filename: string) {
    const current = this.read();
    current.carousel = (current.carousel || []).filter((n) => n !== filename);
    // delete file from disk
    const filePath = join(process.cwd(), 'uploads', filename);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      // ignore
    }
    return this.write(current);
  }

  reorderCarousel(order: string[]) {
    const current = this.read();
    const nextOrder = Array.isArray(order) ? order.filter(Boolean) : [];
    current.carousel = nextOrder;
    return this.write(current);
  }

  replaceCarouselFile(oldFilename: string, files: Express.Multer.File[]) {
    const newNames = (files || []).map((f) => f.filename);
    const newName = newNames[0];
    const current = this.read();
    current.carousel = (current.carousel || []).map((n) => (n === oldFilename ? newName : n));
    // remove old file
    const oldPath = join(process.cwd(), 'uploads', oldFilename);
    try {
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    } catch (err) {
      // ignore
    }
    return this.write(current);
  }
}
