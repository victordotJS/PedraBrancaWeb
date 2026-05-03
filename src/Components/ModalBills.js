import React,{ useState, useEffect, useRef } from 'react';
import { AiOutlineClose} from 'react-icons/ai';

import Modal from 'react-modal'
import "../App.css";

import { db } from '../Services/firebase';

import {
  doc,
  updateDoc
} from 'firebase/firestore';

function ModalEdit(props) {
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editedValue, setEditedValue] = useState(0);
    const totalPagarRef = useRef(0);

    useEffect(() => {
      totalPagarRef.current = props.totalapagar;
    }, [props.totalapagar]);


const handleEditButtonClick = (index) => {
    setEditingIndex(index);
    setEditedValue(props.details[index].valor);
  };


const handleSaveOnClick = async () => {
    if (editingIndex !== null) {
      const newDetails = [...props.details];
      const oldValue = newDetails[editingIndex].valor;
      
      if (newDetails[editingIndex]) {
        newDetails[editingIndex].valor = parseInt(editedValue)
      }
      try {
        if (!isNaN(editedValue)) {
          let novoTotal;
          const prevTotal = totalPagarRef.current;

          if (editedValue > oldValue) {
            novoTotal = prevTotal + (editedValue - oldValue);
          } else if (editedValue < oldValue) {
            novoTotal = prevTotal - (oldValue - editedValue);
          } else {
            console.log('O valor editado é igual ao valor original.');
            novoTotal = prevTotal;
          }

          totalPagarRef.current = novoTotal;
          updateContas(novoTotal, newDetails);
        } else {
          console.log('Valor inválido');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('Seleção inválida');
    }
  };

  const updateContas = async (novoTotal, newDetails) => {
    await updateDoc(doc(db, 'users', props.idEdit), {
        contas: newDetails,
        total_a_pagar: novoTotal,
      });
      console.log('Atualizado com sucesso!')
      setEditingIndex(null);
      setEditedValue('');
      window.location.reload();
  }

 return (
        
        <Modal
        key={props.idEdit}
        isOpen={props.showBills}
        contentLabel="Example Modal"
        overlayClassName="modal-overlay"
        className="modal-content"
        >
         <button onClick={props.onShowBillsHide} 
       style={{border:'none', 
       backgroundColor:"transparent"}}
       >
       <AiOutlineClose size={30} color="black" style={{marginBottom:30}}/>
       </button>

        <div className='editarea'>
            <h2 style={{marginBottom:40}}>Editar contas Proprietário</h2>

            {props.details.map((item, index) => (
          <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <p style={{ marginBottom: '5px', fontSize: '16px', fontWeight: 'bold', marginRight: '10px' }}>Valor: R${item.valor}</p>
            <button
        style={{
          margin: '5px',
          backgroundColor: 'green',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '5px',
          cursor: 'pointer',
        }} onClick={() => handleEditButtonClick(index)}>Editar</button>
            {editingIndex === index && (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="number"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  style={{ padding: '8px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                <button onClick={() => handleSaveOnClick(index)}
                style={{
                    backgroundColor: 'green',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >Salvar</button>
              </div>
            )}
          </div>
        ))}
        </div>

        </Modal> 
                
    )}
export default ModalEdit