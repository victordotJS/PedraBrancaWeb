import React, { useState, useEffect} from 'react'
import { AiFillCheckCircle, AiFillDelete, AiOutlineClose} from 'react-icons/ai';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { db } from '../Services/firebase';

import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';

import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: '50%',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    flexDirection:'column',
    border:'none',
    backgroundColor:"white",
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
    textAlign:'center',
    borderRadius:10,
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function Home() {
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "users");
    const [search, setSearch] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState('')

    useEffect (() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        getUsers();
    }, [])

   const handleEdit = async (id) => {
      await updateDoc(doc(db, 'users', id), {
          status: "pago",
          contas_a_pagar: 0,
          total_a_pagar: 0
      });
      toast.success("Atualizado com sucesso!", {
        position:'top-right',
        autoClose:5000,
        hideProgressBar:false,
        closeOnClick: true})
       
        //reload the page
        setTimeout(() => {
        window.location.reload();
        }, "1500");
        
  };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'users', id));
        toast.success("Proprietário deletado com sucesso!", {
            position:'top-right',
            autoClose:5000,
            hideProgressBar:false,
            closeOnClick: true})
          
            //reload the page
            setTimeout(() => {
              window.location.reload();
              }, "1500");
      };


      // function handleModal() {
      //   setIsOpen(!modalIsOpen);
      // }

      // function closeModal() {
      //   setIsOpen(false)
      // }

    return (
        <div className='home'>
            <input className='searchInput' 
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Pesquise aqui...'/>
            <ul>
            {users
              .filter((item) => {
                return search.toLowerCase() === ''
                  ? item
                  : item.nome.toLowerCase().includes(search);
              })
              .map((user, index) => (
    
                        <div 
                        key={index}
                        className='container-items'>
                            <h3>{user.nome}</h3>
                            <p className='text'>Telefone: {user.telefone}</p>
                            <p className='text'>Leitura: {user.leituraAnterior}m³</p>
                            <p className='text'>Contas a pagar: {user.contas_a_pagar}</p>
                            <p className='text'>Total a pagar: R${user.total_a_pagar}</p>
                            <p className='text'>Status: <strong>{user.status}</strong></p>
                            <button className='buttonsUsers'
                            onClick={() =>  handleEdit(user.id)}>
                            <AiFillCheckCircle size={30} style={{marginTop:10}} color="green"/>
                            </button>
                            <button className='buttonsUsers'
                            onClick={() =>  handleDelete(user.id)}>
                            <AiFillDelete size={30} style={{marginTop:10}} color="red"/>
                            </button>
                    {/* <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={handleModal}
                    style={customStyles}>
        
            <button onClick={closeModal} style={{border:'none', backgroundColor:"transparent"}}>
                <AiOutlineClose size={30} color="black"/>
            </button>
            
                <h2>{user.nome}</h2>
                <form className='form'>
                <input className='inputsEdit'
                placeholder='Insira o nome do proprietário'
                />
                <input className='inputsEdit'
                placeholder='Insira o endereço do proprietário'
                />
                <input className='inputsEdit'
                placeholder='Insira o telefone do proprietário'
                />
                <input className='inputsEdit'
                placeholder='Insira a leitura do proprietário'
                />
                
            <select name='Status'
                className='select' 
                value={status}
                onChange={text => setStatus(text.target.value)}
                >
                <option value="">Status</option>
                <option value="pago">Pago</option>
                <option value="nao-pago">Não pago</option>
                </select>
                </form>
                <button
                 onClick={() =>  handleEdit(user.id)}
                ><h2>FINALIZAR</h2></button>
                </Modal> */}
                        </div>
                        
                    ))}
                    
            </ul>
            <ToastContainer></ToastContainer>
        </div>
      )
}



export default Home