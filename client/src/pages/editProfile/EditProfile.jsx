import { useRef, useState } from 'react';
import './editProfile.scss';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    desc: '',
    mobileNumber: '',
    location: '',
    gender: '',
    profilePicture: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
    setShowDropdown(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    setIsLoading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'medium_clone');
    form.append('cloud_name', 'dmdsqhaiz');

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dmdsqhaiz/image/upload", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      setIsLoading(false);
      console.log("Image uploaded URL:", data.secure_url);
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setIsLoading(false);
      return null;
    }
  };

  const handleUploadAndSubmit = async () => {
    const {
      firstName,
      lastName,
      desc,
      mobileNumber,
      location,
      gender,
      profilePicture
    } = formData;

    const isAllFieldsEmpty =
      !firstName.trim() &&
      !lastName.trim() &&
      !desc.trim() &&
      !mobileNumber.trim() &&
      !location.trim() &&
      !gender.trim() &&
      !selectedImage;

    if (isAllFieldsEmpty) {
      toast.error("Enter something");
      return;
    }

    let imageUrl = profilePicture;

    if (selectedImage) {
      imageUrl = await uploadImageToCloudinary(selectedImage);
      if (!imageUrl) {
        toast.error("Image upload failed");
        return;
      }
    }

    // Prepare body with only updated fields
    const body = {};
    if (firstName) body.firstName = firstName;
    if (lastName) body.lastName = lastName;
    if (desc) body.description = desc;
    if (mobileNumber) body.mobileNumber = mobileNumber;
    if (location) body.location = location;
    if (gender) body.gender = gender;
    if (imageUrl) body.profilePic = imageUrl;

    console.log("Final body to send:", body);

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/updateUser`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success("Profile updated successfully");

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        desc: '',
        mobileNumber: '',
        location: '',
        gender: '',
        profilePicture: ''
      });
      setPreview(null);
      setSelectedImage(null);
window.location.reload()
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="editProfile">
      <h2>Edit Profile</h2>

      <div className="form-group">
        <label>First Name</label>
        <input type="text" name="firstName" value={formData.firstName} placeholder="First Name" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input type="text" name="lastName" value={formData.lastName} placeholder="Last Name" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input type="text" name="desc" value={formData.desc} placeholder="Describe yourself..." onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input type="tel" name="mobileNumber" value={formData.mobileNumber} placeholder="03xx-xxxxxxx" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>City</label>
        <input type="text" name="location" value={formData.location} placeholder="Karachi, Lahore, etc." onChange={handleChange} />
      </div>

      <div className="form-group genderDropdown">
        <label>Gender</label>
        <div className="custom-dropdown" onClick={() => setShowDropdown(prev => !prev)}>
          <span style={{ fontSize: "14px" }}>{formData.gender || "Select Gender"}</span>
          <img src="/img/dropdown.png" alt="dropdown" className={showDropdown ? "rotate" : ""} />
        </div>
        {showDropdown && (
          <div className="dropdown-options">
            <div onClick={() => handleGenderSelect("male")}>Male</div>
            <div onClick={() => handleGenderSelect("female")}>Female</div>
          </div>
        )}
      </div>

      <input
        type="file"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={handleImageChange}
        accept="image/*"
      />

      {/* {preview && (
        <div className="image-preview">
          <img src={preview} alt="Preview" width={100} height={100} style={{ borderRadius: '50%' }} />
        </div>
      )} */}

      <div className="btns" style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <div className="uploadPicBtn">
          <button onClick={() => inputRef.current.click()} style={{ backgroundColor: "royalBlue" }}>Upload Picture</button>
        </div>
        <div className="saveBtn">
          {
            isLoading ?
              <button>Updating profile...</button> :
              <button onClick={handleUploadAndSubmit}>Update Profile</button>
          }
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
