import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { MainApiRequest } from "@/services/MainApiRequest"; // Thay thế với API thực tế của bạn
import "./ProfileUser.scss";
import userImg from "@/assets/cus1.jpg";
import { Tag, message } from "antd";

const ProfileUser = () => {
  const navigate = useNavigate();
  const [id, setId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | File>("");
  const [user, setUser] = useState({ imageUrl: "" });
  const [peachCoin, setPeachCoin] = useState(0);
  const [peachPoint, setPeachPoint] = useState(0);

  // Lấy thông tin người dùng từ API khi component mount
  const fetchUserProfile = async () => {
    try {
      const response = await MainApiRequest.get("/auth/callback");
      setEmail(response.data.data.email);
      setName(response.data.data.name);
      setAddress(response.data.data.address);
      setPhone(response.data.data.phone);
      setImage(response.data.data.image);
      setId(response.data.data.id);
      setPeachCoin(response.data.data.peachCoin);
      setPeachPoint(response.data.data.peachPoint);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Cập nhật thông tin người dùng
  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const updatedData = {
      email,
      name,
      address,
      phone,
      // image
    };
    try {
      await MainApiRequest.put(`/user/${id}`, updatedData);
      // alert("Profile updated successfully!");
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      // alert("Failed to update profile. Please try again.");
      message.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setUser({ ...user, imageUrl: URL.createObjectURL(file) }); // Thay thế ảnh hiện tại bằng URL tạm
      setImage(file); // Lưu ảnh để upload sau
    }
  };

  const handleImageUpload = async () => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image); // Gửi ảnh thực lên server
      try {
        const response = await MainApiRequest.post("/upload-avatar", formData);
        if (response.status === 200) {
          // alert("Image uploaded successfully!");
          message.success("Image uploaded successfully!");
          setUser({ ...user, imageUrl: response.data.imageUrl }); // Cập nhật ảnh từ server
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        // alert("Failed to upload image. Please try again.");
        message.error("Failed to upload image. Please try again.");
      }
    }
  };

  const mapRank = (point: number) => {
    if (point < 1000) return "Bronze";
    if (point < 5000) return "Silver";
    if (point < 10000) return "Gold";
    return "Platinum";
  };

  const mapColor = (point: number) => {
    if (point < 1000) return "orange";
    if (point < 5000) return "gray";
    if (point < 10000) return "gold";
    return "green";
  };

  const mapIcon = (point: number) => {
    if (point < 1000) return "🥉";
    if (point < 5000) return "🥈";
    if (point < 10000) return "🥇";
    return "🏆";
  };

  return (
    <>
      <Breadcrumbs title="Profile User" pagename="Profile User" />
      <section className="profile-section py-5 d-flex justify-content-center align-items-center">
        <Card className="shadow-sm p-4 w-50 ">
          <Card.Header className="border-bottom pb-3">
            <h3 className="h4 font-bold m-0">My Profile</h3>
          </Card.Header>
          <Card.Body>
            <div className="profile-img-container">
              <img
                // src={user.imageUrl || userImg}
                // src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/446873116_7905494119510206_5914400312179930848_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHO6RHsSvDk42AvKJAEDs7JLgJcZXtIjTcuAlxle0iNN0fWxaZYBNAuK1fLecSeIsfssPWsqwXvoamfKjW-a4GB&_nc_ohc=wWFSDnMKMCMQ7kNvgFf0yTJ&_nc_oc=AdghJlwNPdPSMshwXhMm0b0RvLNCr5062FAotaZy3QLnyoGbNAvUJu7s7MXKHKgogqY&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=AnMTydkfiBeTrUP80whmBDE&oh=00_AYCqyowWxqw0tstlVU2jVZ3xVzJ611X0MejWyDP4M4LLJQ&oe=67855CC2"
                alt="Profile"
                className="profile-img"
              />
              <div className="image-upload">
                {/* <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="image-upload-input"
                  className="d-none"
                /> */}
                <span>
                  <strong>Current Rank: </strong>
                  {mapIcon(peachPoint)}
                  <Tag color={mapColor(peachPoint)} className="upload-tag">
                    {mapRank(peachPoint)}
                  </Tag>
                </span>
                {/* <Button
                  variant="primary"
                  onClick={() => document.getElementById("image-upload-input")?.click()}
                  className="upload-btn"
                >
                  Upload Image
                </Button> */}

              </div>
            </div>
            <hr />
            <Form onSubmit={handleUpdateProfile}>
              <Form.Group controlId="email" className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
              </Form.Group>

              <Form.Group controlId="name" className="mb-4">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="address" className="mb-4">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="phone" className="mb-4">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="peachCoin" className="mb-4">
                <Form.Label>Peach Coin</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  value={peachCoin}
                  disabled
                  readOnly
                />
              </Form.Group>
              {/* 
              <Form.Group controlId="peachPoint" className="mb-4">
                <Form.Label>Peach Point</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  value={peachPoint}
                  disabled
                  readOnly
                />
              </Form.Group> */}

              <Button
                className="primaryBtn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </section>
    </>
  );
};

export default ProfileUser;
