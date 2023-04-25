import React,{ useState, useEffect } from 'react';
import { AiOutlineClose} from 'react-icons/ai';

import Modal from 'react-modal'
import "../App.css";

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

function ModalConfirm(props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSelectChange = (event) => {
    setSelectedIndex(parseInt(event.target.value));
  };

    const handleDeleteOnClick = async () => {
      if (selectedIndex >= 0 && selectedIndex < props.details.length) {
        const newDetails = props.details.filter((_, index) => index !== selectedIndex);
        await updateDoc(doc(db, 'users', props.id), {
          valorAnterior: props.totalapagar,
          contas_a_pagar: props.contasapagar - 1,
          total_a_pagar: props.totalapagar - props.details[selectedIndex].valor,
          contas: newDetails,
        });
        window.location.reload();
      } else {
        console.log('Seleção inválida');
      }
    };


 return (
        
        <Modal
        key={props.id}
        isOpen={props.show}
        contentLabel="Example Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
        >

  <h1>{}</h1>

       <button onClick={props.onHide} 
       style={{border:'none', 
       backgroundColor:"transparent"}}
       >
       <AiOutlineClose size={30} color="black" style={{marginBottom:30}}/>
       </button>
       
       <select value={selectedIndex} onChange={handleSelectChange} className='select'>
      <option value={-1}>Selecione uma conta</option>
      {props.details.map((item, index) => (
        <option key={index} value={index}>
          Valor: R${item.valor}
        </option>
      ))}
    </select>

    <button
        className="buttonFinishPayment"
        onClick={handleDeleteOnClick}
      >
        <h3 style={{ color: 'black' }}>Pagar</h3>
      </button>
        
        </Modal> 
                
    )}
export default ModalConfirm