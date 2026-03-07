import { useState } from "react";
import "./ManageCenters.css";

const emptyForm = {
  slug: "",
  name: "",
  fullName: "",
  rating: "",
  reviews: "",
  phone: "",
  lat: "",
  lng: "",
  mapEmbed: "",
  mapQuery: "",
  address: "",
  timing: "",
  heroBg: null,
  image: null,
  description: "",
  gallery: []
};

const ManageCenters = () => {

  const [centers,setCenters] = useState([]);
  const [form,setForm] = useState(emptyForm);
  const [showModal,setShowModal] = useState(false);
  const [editId,setEditId] = useState(null);
  const [dragIndex,setDragIndex] = useState(null);

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleImageUpload = (e,field)=>{
    const file = e.target.files[0];
    if(!file) return;

    const url = URL.createObjectURL(file);

    setForm({
      ...form,
      [field]: {file,url}
    });
  };

  const handleGalleryUpload = (e)=>{
    const files = Array.from(e.target.files);

    const images = files.map(file=>({
      file,
      url: URL.createObjectURL(file)
    }));

    setForm({
      ...form,
      gallery:[...form.gallery,...images]
    });
  };

  const removeGalleryImage = (index)=>{
    const newGallery = [...form.gallery];
    newGallery.splice(index,1);

    setForm({...form,gallery:newGallery});
  };

  const handleSubmit = ()=>{

    const newCenter = {
      id: editId || Date.now(),
      ...form
    };

    if(editId){
      setCenters(centers.map(c=>c.id===editId?newCenter:c));
    }else{
      setCenters([...centers,newCenter]);
    }

    setForm(emptyForm);
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (center)=>{
    setEditId(center.id);
    setForm(center);
    setShowModal(true);
  };

  const handleDelete = (id)=>{
    if(!window.confirm("Delete this center?")) return;

    setCenters(centers.filter(c=>c.id!==id));
  };

  const dragStart = (index)=>setDragIndex(index);

  const dragOver = (index)=>{
    const newGallery=[...form.gallery];
    const dragged=newGallery[dragIndex];
    newGallery.splice(dragIndex,1);
    newGallery.splice(index,0,dragged);
    setDragIndex(index);
    setForm({...form,gallery:newGallery});
  };

  return (
    <div className="admin-centers-page">

      <div className="admin-centers-header">
        <h2>Manage ICTC Centers</h2>
        <button
          className="admin-add-btn"
          onClick={()=>{setForm(emptyForm);setShowModal(true)}}
        >
          + Add Center
        </button>
      </div>

      {/* TABLE */}

      <div className="admin-centers-table-wrapper">

        <table className="admin-centers-table">

          <thead>
            <tr>
              <th>Hero</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Slug</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {centers.map(center=>(
              <tr key={center.id}>

                <td>
                  {center.heroBg &&
                    <img
                      src={center.heroBg.url}
                      className="admin-table-img"
                    />
                  }
                </td>

                <td>{center.name}</td>
                <td>{center.phone}</td>
                <td>{center.slug}</td>
                <td>{center.rating}</td>

                <td className="admin-actions">

                  <button
                    className="admin-edit-btn"
                    onClick={()=>handleEdit(center)}
                  >
                    Edit
                  </button>

                  <button
                    className="admin-delete-btn"
                    onClick={()=>handleDelete(center.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>


      {/* MODAL FORM */}

      {showModal && (
        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <h3>{editId ? "Edit Center" : "Add Center"}</h3>

            <div className="admin-form-grid">

              <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange}/>
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange}/>
              <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange}/>
              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}/>

              <input name="rating" placeholder="Rating" value={form.rating} onChange={handleChange}/>
              <input name="reviews" placeholder="Reviews" value={form.reviews} onChange={handleChange}/>
              <input name="timing" placeholder="Timing" value={form.timing} onChange={handleChange}/>

              <input name="lat" placeholder="Latitude" value={form.lat} onChange={handleChange}/>
              <input name="lng" placeholder="Longitude" value={form.lng} onChange={handleChange}/>

              <input name="mapQuery" placeholder="Map Query" value={form.mapQuery} onChange={handleChange}/>
              <input name="mapEmbed" placeholder="Google Map Embed" value={form.mapEmbed} onChange={handleChange}/>

              <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange}/>

            </div>


            {/* HERO IMAGE */}

            <div className="admin-upload-section">

              <label>Hero Image</label>

              <input type="file" onChange={(e)=>handleImageUpload(e,"heroBg")} />

              {form.heroBg &&
                <img src={form.heroBg.url} className="admin-preview-img"/>
              }

            </div>


            {/* CENTER IMAGE */}

            <div className="admin-upload-section">

              <label>Center Image</label>

              <input type="file" onChange={(e)=>handleImageUpload(e,"image")} />

              {form.image &&
                <img src={form.image.url} className="admin-preview-img"/>
              }

            </div>


            {/* RICH TEXT DESCRIPTION */}

            <div className="admin-upload-section">

              <label>Description</label>

              <div
                className="admin-rich-editor"
                contentEditable
                onInput={(e)=>setForm({...form,description:e.currentTarget.innerHTML})}
                dangerouslySetInnerHTML={{__html:form.description}}
              />

            </div>


            {/* GALLERY */}

            <div className="admin-upload-section">

              <label>Gallery Upload</label>

              <input type="file" multiple onChange={handleGalleryUpload}/>

              <div className="admin-gallery-grid">

                {form.gallery.map((img,index)=>(
                  <div
                    key={index}
                    className="admin-gallery-item"
                    draggable
                    onDragStart={()=>dragStart(index)}
                    onDragOver={()=>dragOver(index)}
                  >

                    <img src={img.url}/>

                    <button
                      onClick={()=>removeGalleryImage(index)}
                      className="admin-remove-img"
                    >
                      ✕
                    </button>

                  </div>
                ))}

              </div>

            </div>


            <div className="admin-modal-actions">

              <button className="admin-submit-btn" onClick={handleSubmit}>
                {editId ? "Update Center" : "Create Center"}
              </button>

              <button
                className="admin-cancel-btn"
                onClick={()=>setShowModal(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ManageCenters;