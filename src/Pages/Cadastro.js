import React, { useState } from 'react'
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
} from 'firebase/firestore';

import { db } from '../Services/firebase';

import { useNavigate } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cadastro() {
    const [nome, setNome] = useState('')
    const [endereco, setEndereco] = useState('')
    const [telefone, setTelefone] = useState('')
    const [leituraAnterior, setLeituraAnterior] = useState('')

    let navigate = useNavigate();

    const handleCadastro = async (e) => {
      e.preventDefault(e);
      if (nome === '', endereco === '', telefone === '', leituraAnterior === '') {
        alert('Por favor, preencha todos os campos!');
        return;
      }
      await addDoc(collection(db, 'users'), {
      nome,
      endereco,
      telefone,
      leituraAnterior,
      status: 'nao-pago',
      contas_a_pagar: 0,
      total_a_pagar: 0,
      created_at: new Date()
      });
      setNome('');
      setEndereco('');
      setTelefone('');
      setLeituraAnterior('');
      toast.success("Proprietário cadastrado com sucesso!", {
        position:'top-right',
        autoClose:5000,
        hideProgressBar:false,
        closeOnClick: true});
        setTimeout(() => {
          navigate("/");
        }, "6000");
    };


  return (
    <div className='cadastro'>
        <h1 className='title'>Cadastrar Proprietário</h1>
        <form onSubmit={handleCadastro} className='form'>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className='inputsAdd'
            type='text'
            placeholder='Insira o nome do Proprietário'
          />
          <input
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className='inputsAdd'
            type='text'
            placeholder='Insira o endereco'
          />
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className='inputsAdd'
            type='text'
            placeholder='Insira o telefone'
          />
          <input
            value={leituraAnterior}
            onChange={(e) => setLeituraAnterior(e.target.value)}
            className='inputsAdd'
            type='text'
            placeholder='Insira a leitura anterior em m³'
          />
          <button className='button' type="submit"> 
          <h3>Cadastrar</h3>
          </button>
        </form>
        <ToastContainer></ToastContainer>
    </div>
  )
}

export default Cadastro