import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function createPDF(users) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle = [
        {
            text: 'Relatório Mensal',
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45] // left, top, right, bottom
        }
    ];

    const dados = users.map((user) => {
        return [
            {text: user.nome, fontSize: 9, margin: [0, 2, 0, 2]},
            {text: user.telefone, fontSize: 9, margin: [0, 2, 0, 2]},
            {text: user.leitura, fontSize: 9, margin: [0, 2, 0, 2]},
            {text: user.contas_a_pagar, fontSize: 9, margin: [0, 2, 0, 2]},
            {text: user.total_a_pagar, fontSize: 9, margin: [0, 2, 0, 2]}
        ] 
    });

    const details = [
        {
            table:{
                headerRows: 1,
                widths: ['*', '*', '*', '*'],
                body: [
                    [
                        {text: 'Nome', style: 'tableHeader', fontSize: 10},
                        {text: 'Telefone', style: 'tableHeader', fontSize: 10},
                        {text: 'Leitura', style: 'tableHeader', fontSize: 10},
                        {text: 'Contas a pagar', style: 'tableHeader', fontSize: 10},
                        {text: 'Valor', style: 'tableHeader', fontSize: 10},
                        {text: 'Status', style: 'tableHeader', fontSize: 10}
                    ],
                    ...dados
                ]
            },
            layout: 'lightHorizontalLines' // headerLineOnly
        }
    ];

    function Rodape(currentPage, pageCount){
        return [
            {
                text: currentPage + ' / ' + pageCount,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 10, 20, 0] // left, top, right, bottom
            }
        ]
    }

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],

        header: [reportTitle],
        content: [details],
        footer: Rodape
    }

    pdfMake.createPdf(docDefinition).print();
}


export default createPDF;