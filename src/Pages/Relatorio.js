import React, { useState, useEffect, useRef, useCallback } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { db } from '../Services/firebase';

import {
  collection,
  getDocs,
  writeBatch,
  addDoc
} from 'firebase/firestore';

import { AiFillPrinter, AiFillCheckCircle } from 'react-icons/ai';

import { useReactToPrint } from 'react-to-print'
import logo from '../Assets/logo.png'


function Relatorio() {
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "users");
    const [dateNow, setDateNow] = useState('');

    const [totalRecebido, setTotalRecebido] = useState(0)

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isUploading, setIsUploading] = useState(false);

    const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'relatorio ' + dateNow,
    onAfterPrint: () => toast.success("Impresso com sucesso!", {
      position:'top-right',
      autoClose:5000,
      hideProgressBar:false,
      closeOnClick: true})
  })
  
  
  const sum = users?.reduce((acc, current) => 
  acc + current.total_a_pagar, 0) ?? 0;

  const sumArray = useCallback(async () => {
    const querySnapshot = await getDocs(usersCollectionRef);
    let total = 0;
    querySnapshot.forEach((doc) => {
      const array = doc.data().contasPagas;
      array.forEach((item) => {
        total += item.valor;
      });
    });
    setTotalRecebido(total)
  }, [usersCollectionRef])
  
    useEffect (() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        getUsers();
        sumArray();
        var dataAtual = new Date();
        var date = new Intl.DateTimeFormat('pt-BR', 
        {dateStyle: 'short'}).format(dataAtual);
        var hours = dataAtual.getHours();
        setDateNow(date + ' às ' + hours + 'h.');
    }, [usersCollectionRef, sumArray])


    function handleOpenModal() {
      setIsModalOpen(true);
    }
  
    function handleCloseModal() {
      setIsModalOpen(false);
    }

    function handleConfirmModal() {
      closeRelatory();
      setIsModalOpen(false);
    }

    async function closeRelatory() {
      try {
        setIsUploading(true);
    
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);
    
        const docsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
    
        const jsonString = JSON.stringify(docsArray);
    
        await addDoc(collection(db, "backups"), {
          data: docsArray,
          json: jsonString,
          createdAt: new Date()
        });
    
        const batch = writeBatch(db);
    
        querySnapshot.forEach((docSnap) => {
          const contasPagas = docSnap.data().contasPagas || [];
    
          if (Array.isArray(contasPagas) && contasPagas.length > 0) {
            batch.update(docSnap.ref, {
              contasPagas: []
            });
          }
        });
    
        await batch.commit();
    
        toast.success("Relatório mensal finalizado!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true
        });
    
        setTimeout(() => {
          window.location.reload();
        }, 500);
    
      } catch (error) {
        console.error(error);
    
        toast.error("Erro ao finalizar relatório!", {
          position: "top-right"
        });
    
      } finally {
        setIsUploading(false);
      }
    }

    function ConfirmModal({ isOpen, onClose, onConfirm }) {
      if (!isOpen) {
        return null;
      }
    
      return (
        <div className="modalConfirmation">
          <div className="modalConfirmation-content">
            <h3>Você tem certeza que deseja fechar o relatório mensal?</h3>
            <div className="modalConfirmation-buttons">
              <button 
              className='buttonConfimationRelatory'
              style={{
                border:'none', 
                backgroundColor:'red', 
                marginRight:20,
                width:'20%',
                height:30,
                borderRadius:7,
                color:'white',
                fontSize:16,
                fontWeight:'bold',
                cursor:'pointer'
                }} onClick={onClose}>Não</button>
              <button 
              className='buttonConfimationRelatory'
              style={{
                border:'none', 
                backgroundColor:'green',
                width:'20%',
                height:30,
                borderRadius:7,
                color:'white',
                fontSize:16,
                fontWeight:'bold',
                cursor:'pointer'
                }} onClick={onConfirm}>Sim</button>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className='relatorio'>
      <ToastContainer></ToastContainer>
        <h1>Relatório Mensal</h1>
        <div style={{marginTop:10}}>
        <button className='closerelatory-button' onClick={() =>  handleOpenModal()}>
          <p style={{color:'#fff', fontWeight:'600'}}>Finalizar o mês</p>
          <AiFillCheckCircle size={24} style={{marginLeft:7}} color="white"/>
        </button>
        </div>
        <button className='print-button' onClick={handlePrint}>
        <p style={{color:'#fff', fontWeight:'600'}}>Imprimir</p>
        <AiFillPrinter size={24} style={{marginLeft:7}} color="white"/>
        </button>
        {isUploading && <h2>Carregando...</h2>}
        <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
        <div ref={componentRef}>
        <div style={{textAlign:'end'}}>
        <h3>Data de emissão: {dateNow}</h3>
        </div>
        <img src={logo} alt="Logo" style={{
            resizeMode: 'stretch',
            height:'20%',
            width: '60%',
            marginTop:20
          }}/>
        <table>
        
      <thead>
        <tr>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Leitura</th>
          <th>Contas Pagas/Valor</th>
          <th>Contas a pagar/Valor</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
      {users.sort((a, b) => a.nome.localeCompare(b.nome)).map((user) => {
  const somaContasPagas = user.contasPagas.reduce((acc, curr) => acc + curr.valor, 0);
  return (
    <tr key={user.id}>
      <td>{user.nome}</td>
      <td>{user.telefone}</td>
      <td>{user.leituraAnterior}m²</td>
      <td>({user.contasPagas.length}) R${somaContasPagas}</td>
      <td>({user.contas.length}) R${user.total_a_pagar}</td>
      {user.status === "nao-pago" ? (
        <td style={{color:'red'}}>Não Pago</td>
      ) : (
        <td style={{color:'green'}}>Pago</td>
      )}
    </tr>
  );
})}
      </tbody>
    </table>
    <div>
    <hr
        style={{
          background: 'black',
          color: 'black',
          borderColor: 'black',
          height: '3px',
        }}
      />
      <h3 style={{margin:5}}>Total recebido: R${totalRecebido},00</h3>
      <h3 style={{margin:5}}>Total a receber: R${sum},00</h3>
    </div>
    </div>
    </div>
  );
}

export default Relatorio;