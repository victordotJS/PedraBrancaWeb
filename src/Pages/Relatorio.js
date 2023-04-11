import React, { useState, useEffect, useRef} from 'react';

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

import { AiFillPrinter } from 'react-icons/ai';

import { useReactToPrint } from 'react-to-print'
import logo from '../Assets/logo.png'

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;


function Relatorio() {
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "users");
    const [dateNow, setDateNow] = useState('');

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
  
  //   function createPDF(users) {

  //     const reportTitle = [
  //         {
  //             text: 'Relatório Mensal',
  //             fontSize: 15,
  //             bold: true,
  //             margin: [15, 20, 0, 45] // left, top, right, bottom
  //         }
  //     ];
  
  //     const dados = users.map((user) => {
  //         return [
  //             {text: user.nome, fontSize: 9, margin: [0, 2, 0, 2]},
  //             {text: user.telefone, fontSize: 9, margin: [0, 2, 0, 2]},
  //             {text: user.leitura, fontSize: 9, margin: [0, 2, 0, 2]},
  //             {text: user.contas_a_pagar, fontSize: 9, margin: [0, 2, 0, 2]},
  //             {text: user.total_a_pagar, fontSize: 9, margin: [0, 2, 0, 2]}
  //         ] 
  //     });
  
  //     const details = [
  //         {
  //             table:{
  //                 headerRows: 1,
  //                 widths: ['*', '*', '*', '*', '*'],
  //                 body: [
  //                     [
  //                         {text: 'Nome', style: 'tableHeader', fontSize: 10},
  //                         {text: 'Telefone', style: 'tableHeader', fontSize: 10},
  //                         {text: 'Leitura', style: 'tableHeader', fontSize: 10},
  //                         {text: 'Contas a pagar', style: 'tableHeader', fontSize: 10},
  //                         {text: 'Valor', style: 'tableHeader', fontSize: 10},
  //                         {text: 'Status', style: 'tableHeader', fontSize: 10}
  //                     ],
  //                     ...dados
  //                 ]
  //             },
  //             layout: 'lightHorizontalLines' // headerLineOnly
  //         }
  //     ];
  
  //     function Rodape(currentPage, pageCount){
  //         return [
  //             {
  //                 text: currentPage + ' / ' + pageCount,
  //                 alignment: 'right',
  //                 fontSize: 9,
  //                 margin: [0, 10, 20, 0] // left, top, right, bottom
  //             }
  //         ]
  //     }
  
  //     const docDefinition = {
  //         pageSize: 'A4',
  //         pageMargins: [15, 50, 15, 40],
  
  //         header: [reportTitle],
  //         content: [details],
  //         footer: Rodape
  //     }
  
  //     pdfMake.createPdf(docDefinition).download();
  // }
  

    useEffect (() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        var dataAtual = new Date();
        var date = new Intl.DateTimeFormat('pt-BR', 
        {dateStyle: 'short'}).format((date));
        var hours = dataAtual.getHours();
        setDateNow(date + ' às ' + hours + 'h.');

        getUsers();
    }, [])


  return (
    <div className='relatorio'>
      <ToastContainer></ToastContainer>
        <h1>Relatório Mensal</h1>
        
        <button className='print-button' onClick={handlePrint}>
        <AiFillPrinter size={30} style={{marginTop:5}} color="white"/>
        </button>
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
          <th>Contas a pagar/Valor</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
      {users.sort((a, b) => a.nome.localeCompare(b.nome)).map((user) => (
        <tr key={user.id}>
          <td>{user.nome}</td>
          <td>{user.telefone}</td>
          <td>{user.leituraAnterior}m²</td>
          <td>({user.contas_a_pagar}) R${user.total_a_pagar}</td>
          {user.status === "nao-pago" ? (
        <td style={{color:'red'}}>Não Pago</td>
      ) : (
        <td style={{color:'green'}}>Pago</td>
      )}
          {/* <td>{user.status}</td> */}
        </tr>
        ))}
      </tbody>
    </table></div>
    </div>
  );
}

export default Relatorio;