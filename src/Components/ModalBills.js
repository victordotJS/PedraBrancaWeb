import React,{ useState } from 'react';
import { AiOutlineClose} from 'react-icons/ai';

import Modal from 'react-modal'
import "../App.css";

import { db } from '../Services/firebase';

import {
  doc,
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
        const novoValorcontasapagar = props.contasapagar == 0 ? props.contasapagar : props.contasapagar - 1
        await updateDoc(doc(db, 'users', props.id), {
          status: novoValorcontasapagar == 0 ? 'pago' : 'nao-pago',
          valorAnterior: props.totalapagar,
          contas_a_pagar: novoValorcontasapagar,
          total_a_pagar: props.totalapagar - props.details[selectedIndex].valor,
          contas: newDetails,
          contasPagas: [
            ...props.contasPagas,
            props.details[selectedIndex]
          ]
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
       <AiOutlineClose size={30} color="black" style={{marginBottom:20}} className='closeModalBtn'/>
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