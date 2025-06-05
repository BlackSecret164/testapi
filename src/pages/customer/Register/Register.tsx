// import { LoadingOverlay } from 'react-loading-overlay';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystemContext } from '@/hooks/useSystemContext';
import { MainApiRequest } from '@/services/MainApiRequest';

const Register = () => {
    const navigate = useNavigate();
    const context = useSystemContext();
    const {
        isLoggedIn,
        token
    } = context;

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [phone, setPhone] = React.useState('');

    const handleRegister = async () => {
        const res = await MainApiRequest.post('/auth/register', {
            email,
            password,
            name,
            address,
            phone,
        });

        if (res.status === 200) {
            navigate('/login');
        }
    }

    return (
        // <LoadingOverlay
        //     active={isLoggedIn}
        //     styles={{
        //         wrapper: {
        //             height: "100vh"
        //         }
        //     }}
        //     spinner
        // >
        <section className="h-100 bg-login">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                        <div className="text-center my-5">
                            <img src={require("@/assets/logo.jpg")} alt="logo" width="100" />
                        </div>
                        <div className="card shadow-lg">
                            <div className="card-body p-5">
                                <h1 className="fs-4 card-title fw-bold mb-4">Register</h1>
                                <form method="POST" className="needs-validation">
                                    <div className="mb-3">
                                        <label className="mb-2 text-muted">E-Mail</label>
                                        <input id="email" type="email" className="form-control" name="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                                        <div className="invalid-feedback">
                                            Email invalid
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted">Password</label>
                                        </div>
                                        <input id="password" type="password" className="form-control" name="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
                                        <div className="invalid-feedback">
                                            Password invalid
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="mb-2 text-muted">Full Name</label>
                                        <input id="name" type="text" className="form-control" name="name" value={name} required onChange={(e) => setName(e.target.value)} />
                                        <div className="invalid-feedback">
                                            Name is invalid
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="mb-2 text-muted">Address</label>
                                        <input id="address" type="text" className="form-control" name="address" value={address} required onChange={(e) => setAddress(e.target.value)} />
                                        <div className="invalid-feedback">
                                            Address is invalid
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="mb-2 text-muted">Phone</label>
                                        <input id="phone" type="text" className="form-control" name="phone" value={phone} required onChange={(e) => setPhone(e.target.value)} />
                                        <div className="invalid-feedback">
                                            Phone is invalid
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <button type="button" onClick={handleRegister} className="btn btn-primary ms-auto">
                                            Register
                                        </button>
                                    </div>

                                    <hr className="my-4" />

                                    <div className="d-flex justify-content-center mt-3">
                                        <a href="/login" className="text-muted">
                                            Already have an account? Login now
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="text-center mt-5 text-muted">
                            Copyright &copy; 2024 &mdash; PeachHotel
                        </div>
                    </div>
                </div>
            </div>
        </section>
        // </LoadingOverlay>
    );
};

export default Register;