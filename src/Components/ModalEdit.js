import React,{ useState, useEffect } from 'react';
import { AiOutlineClose} from 'react-icons/ai';

import Modal from 'react-modal'
import "../App.css";

import InputMask from 'react-input-mask';

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

function ModalEdit(props) {
  
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [leituraAnterior, setLeituraAnterior] = useState('');

  useEffect(() => {
    setNome(props.userName);
    setEndereco(props.userAdress)
    setTelefone(props.userPhone)
    setLeituraAnterior(props.userLeituraAnterior)
  }, [props.userName, props.userAdress, props.userPhone, props.userLeituraAnterior]);
  

  const handleEdit = async (id) => {
      await updateDoc(doc(db, 'users', props.idEdit), {
          nome: nome,
          endereco: endereco,
          telefone: telefone,
          leituraAnterior: leituraAnterior
      });
      toast.warn("Atualizado!", {
        position:'top-center',
        autoClose:5000,
        hideProgressBar:false,
        closeOnClick: true})
       
        //reload the page
        setTimeout(() => {
        window.location.reload();
        }, "500");
        
  };


 return (
        
        <Modal
        key={props.idEdit}
        isOpen={props.showEdit}
        contentLabel="Example Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
        >
         <button onClick={props.onEditHide} 
       style={{border:'none', 
       backgroundColor:"transparent"}}
       >
       <AiOutlineClose size={30} color="black" style={{marginBottom:30}}/>
       </button>

        <div className='editarea'>
            <h2 style={{marginBottom:10}}>Editar dados do Proprietário</h2>
            <input
      className='inputedit' 
      value={nome}
      onChange={(e) => setNome(e.target.value)}
      placeholder='Insira o novo nome do proprietário'
    />
    <InputMask 
      className='inputedit'
      mask="(99) 99999-9999" 
      value={telefone}
      onChange={(e) => setTelefone(e.target.value)}
      placeholder='Insira o novo telefone do proprietário'
    />
    <input 
      className='inputedit' 
      value={endereco}
      onChange={(e) => setEndereco(e.target.value)}
      placeholder='Insira o novo endereço do proprietário'
    />
    <input 
      className='inputedit' 
      value={leituraAnterior}
      onChange={(e) => setLeituraAnterior(e.target.value)}
      placeholder='Insira a nova leitura do proprietário'
    />
            <button
        className="buttonEdit"
        onClick={() =>  handleEdit(props.idEdit)}
      >
        <h3 style={{ color: 'black' }}>Editar</h3>
      </button>
        </div>

        </Modal> 
                
    )}
export default ModalEdit