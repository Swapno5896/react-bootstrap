import './App.css';
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import app from './firebase,init';
// react bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
function App() {
  const auth = getAuth(app);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [regestered, setRegestered] = useState(false);
  const [isEmailVarified, SetIsEmailVarified] = useState(false)
  // set error to show
  const [err, setErr] = useState('')

  // for validation
  const [validated, setValidated] = useState(false);

  // hadel input fild
  const handelBlutEmail = (event) => {
    setEmail(event.target.value)
  }

  const handelBlutPass = (event) => {
    setPass(event.target.value)
  }

  //  handel restered or login
  const handelRegesterChange = event => {
    setRegestered(event.target.checked);
  }
  // handel submit button
  const handelSumbit = (event) => {
    event.preventDefault();
    // bootstrap validation
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return
    }
    // checking password wheather container 6 character and a number or not
    if (!/^(?=.{6,20}$)\D*\d/.test(pass)) {
      setErr('Password should be at least 6 character and should contain one number')
      return
    }
    setValidated(true);
    setErr('')
    // creation user
    console.log(email, pass);
    event.preventDefault();

    // if regestesred then we will login
    if (regestered) {
      signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErr(errorMessage);
        });


      //

    }

    // if not regestesred then we will regestered
    else {
      createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user);

          //  clean form
          setPass('');
          setEmail('');

          // send verify email
          sendEmailToVerify()
          // ...
        })
        .catch((error) => {

          const errorCode = error.code;
          const errorMessage = error.message;
          setErr(errorMessage);
          // ..
        });
    }

  }

  // send verification email
  const sendEmailToVerify = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        SetIsEmailVarified(true)
        // Email verification sent!
        // ...
      });
  }

  // reset password
  const handelPasswordResest = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        console.log('reset email send');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErr(errorMessage);
        // ..
      });
  }
  return (
    <div className='w-50 mx-auto mt-5'>
      <h3 className='text-primary'>{regestered ? 'LogIn' : 'Regester'} Hear</h3>
      <h3>{isEmailVarified ? 'User varified by elail' : ''}</h3>
      <Form noValidate validated={validated} onSubmit={handelSumbit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control required onBlur={handelBlutEmail} type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please provide a valid Email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control required onBlur={handelBlutPass} type="password" placeholder="Password" />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group onChange={handelRegesterChange} className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Already Regestered ?" />
        </Form.Group>
        <p className='text-danger'>{err}</p>
        <Button variant='link' onClick={handelPasswordResest}>
          Forget Password ?
        </Button>
        <br />
        <Button variant="primary" type="submit">
          {regestered ? 'LogIn' : 'Regester'}
        </Button>
      </Form>
    </div>
  );
}

export default App;
