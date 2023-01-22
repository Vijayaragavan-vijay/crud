import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Container, Form, FormGroup, Navbar, Row, Table } from 'react-bootstrap';
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import { toast, ToastContainer } from 'react-toastify';
// import './App.css';

function App() {
  const api = 'http://localhost:4000/users';
  const [user, setUser] = useState([]);
  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = async () => {
    const response = await axios.get(api);
    setUser(response.data);
  }
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
  });
  const [userId,setUserId]=useState(null);
  const [editMode,setEditMode]=useState(false);

  // console.log(user);
  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete?')) {
      axios.delete(`${api}/${id}`);
      toast.error('Deleted Successfully');
      setTimeout(() => {
        loadUsers();
      }, 4500)
    }
  }
 
  const handleUpdate=(id)=>{
    const singleUser=user.find(item=>item.id===id);
    setFormData(singleUser);
    setUserId(id);
    setEditMode(true);
  }
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  }
  console.log(formData);
  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.address || !formData.contact){
      toast.error('Please enter all fields');
    }
    else{
      if(!editMode){
        axios.post(api,formData);
        toast.success('Added Successfully');
        // loadUsers();
        setTimeout(()=>{
          loadUsers();
        },500);
        formData.name='';
        formData.email='';
        formData.address='';
        formData.contact='';
      }
      else{
        axios.put(`${api}/${userId}`,formData);
        toast.success('Updated Successfully');
        setTimeout(()=>{
          loadUsers();
        },500);
        formData.name='';
        formData.email='';
        formData.address='';
        formData.contact='';
        setEditMode(false);
      }
      
    }
  }
  return (
    <div className="App">
      <Navbar bg='primary' variant='dark' className='justify-content-center' style={{ marginBottom: '35px' }} >
        <Navbar.Brand>
          Build react app with JSON Server
        </Navbar.Brand>
      </Navbar>
      <Container>
        <Row>
          <Col md={4}>
            <Form onSubmit={handleSubmit} >
              <FormGroup>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your Name" />
              </FormGroup>
              <FormGroup>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
              </FormGroup>
              <FormGroup>
                <Form.Label>Contact</Form.Label>
                <Form.Control type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter your Contact number" />
              </FormGroup>
              <FormGroup>
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your Address" />
              </FormGroup>
              <div className='d-grid gap-2 mt-2'>                
                <Button type='submit' variant='primary'  size='lg'>{editMode?'Update':'Submit'}</Button>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              {user.map((element, index) => {
                return (<tbody  key={index} >
                  <tr>
                    <td>{index + 1}</td>
                    <td>{element.name}</td>
                    <td>{element.email}</td>
                    <td>{element.contact}</td>
                    <td>{element.address}</td>
                    <td>
                      <ButtonGroup>
                        <Button style={{ marginRight: '5px' }} variant="success" onClick={()=>handleUpdate(element.id)}>Update</Button>
                        <Button style={{ marginLeft: '5px' }} variant="danger" onClick={() => handleDelete(element.id)}>Delete</Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                </tbody>);


              })}

            </Table>
          </Col>
        </Row>
      </Container>
      <ToastContainer />

    </div>
  );
}

export default App;
