import React, { useState, useEffect} from 'react'
import { AiFillCheckCircle, AiFillDelete} from 'react-icons/ai';

import { FaPenSquare, FaSearch } from 'react-icons/fa'

import ModalConfirm from '../Components/Modal';
import ModalEdit from '../Components/ModalEdit';

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
import "../App.css";


Modal.setAppElement('#root');


function Home() {
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "users");
    const [search, setSearch] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false)
    const [modalEditIsOpen, setEditIsOpen] = useState(false)

    const [arrDetails, setArrDetails] = useState([]);
    const [userId, setUserId] = useState(undefined)
    const [userIdEdit, setUserIdEdit] = useState('')
    const [nome, setNome] = useState('')
    const [endereco, setEndereco] = useState('')
    const [telefone, setTelefone] = useState('')
    const [leituraAnterior, setLeituraAnterior] = useState('')
    const [totalAPagar, setTotalAPagar] = useState(undefined)
    const [contasApagar, setContasApagar] = useState(undefined)
    const [contasPagas, setContasPagas] = useState(undefined)

    useEffect (() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        getUsers();
    }, [])

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


      function handleModal() {
        setIsOpen(!modalIsOpen);
      }

      function closeModal() {
        setIsOpen(false)
      }

      function handleEditModal() {
        setEditIsOpen(!modalEditIsOpen);
      }

      function closeEditModal() {
        setEditIsOpen(false)
      }

    return (
        <div className='home'>
          <div>
            <input className='searchInput' 
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Pesquise aqui...'/>
            <span className='searchIcon'>
            <FaSearch color="black" size={20} style={{marginRight:10, marginTop:10}}/>
            </span>
            </div>
            <ul>
            {users
              .filter((item) => {
                return search.toLowerCase() === ''
                  ? item
                  : item.nome.toLowerCase().includes(search);
              }).sort((a, b) => a.nome.localeCompare(b.nome))
              .map((user, index) => (
    
                        <div 
                        key={index}
                        className='container-items'>
                          
                          <ModalConfirm
                         show={modalIsOpen}
                         onHide={closeModal}
                         details={arrDetails}
                         contasapagar={contasApagar}
                         id={userId}
                         totalapagar={totalAPagar}
                         contasPagas={contasPagas}
                          />

                          <ModalEdit
                          className="modaledit"
                          showEdit={modalEditIsOpen}
                          onEditHide={closeEditModal}
                          idEdit={userIdEdit}
                          userName={nome}
                          userPhone={telefone}
                          userAdress={endereco}
                          userLeituraAnterior={leituraAnterior}
                          />

                            <h3>{user.nome}</h3>
                            <p className='text'>Telefone: {user.telefone}</p>
                            <p className='text'>Leitura: {user.leituraAnterior}m³</p>
                            <p className='text'>Contas a pagar: {user.contas.length}</p>
                            <p className='text'>Total a pagar: R${user.total_a_pagar}</p>
                            {user.status === "nao-pago" ? (
        <p  className='text'>Status: <strong style={{color:'red'}}>Não pago</strong></p>
      ) : (
        <p className='text'>Status: <strong style={{color:'green'}}>Pago</strong></p>
      )}
                          <div style={{textAlign:'end'}}>
                            
                            {/* edit */}
                          <button className='buttonsUsers'
                            data-title="Editar"
                            onClick={() =>  {
                              setUserIdEdit(user.id)
                              setNome(user.nome)
                              setEndereco(user.endereco)
                              setTelefone(user.telefone)
                              setLeituraAnterior(user.leituraAnterior)
                              handleEditModal()
                              }
                              }>
                            <FaPenSquare size={30} style={{marginTop:10}} color="#cc9f18" />
                            </button>

                            {/* payment */}
                            <button className='buttonsUsers'
                            data-title="Pagar"
                            onClick={() =>  {
                            setArrDetails(user.contas);
                            setUserId(user.id)
                            setTotalAPagar(user.total_a_pagar)
                            setContasApagar(user.contas.length)
                            setContasPagas(user.contasPagas)
                            // console.log(user.contas)
                            handleModal()
                            }
                            }>
                            <AiFillCheckCircle size={30} style={{marginTop:10}} color="green"/>
                            </button>
                            
                            {/* delete */}
                            <button className='buttonsUsers'
                            data-title="Deletar"
                            onClick={() =>  handleDelete(user.id)}>
                            <AiFillDelete size={30} style={{marginTop:10}} color="red" />
                            </button>
                            </div>
                        </div>
                        
                    ))}
                    
            </ul>
            <ToastContainer></ToastContainer>
        </div>
      )
}



export default Home