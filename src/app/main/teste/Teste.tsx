// @ts-nocheck
import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container } from '@mui/system';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import TesteHeader from './HeaderTeste';
import { apagarRecados, buscaRecados, deleteJ, selectAll } from './store/recSlice';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Teste = () => {
  const [abrirmodal, setAbrirModal] = React.useState(false);

  const [acao, setAcao] = useState('');
  const [id, setId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [recado, setRecado] = useState('');
  const [aux, setAux] = useState([]);

  const recSliceRedux = useAppSelector(selectAll);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('jwt_access_token');
    dispatch(buscaRecados(token));
  }, []);

  useEffect(() => {
    setAux(recSliceRedux);
  }, [recSliceRedux]);

  const fecharModal = () => {
    console.log('chamou o fechar modal');
    setAbrirModal(false);
  };

  const novorecado = () => {
    setAcao('Novo Recado');
    setAbrirModal(true);
  };

  function apagar(id: any) {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: `Você realmanete deseja apagar registro?:<br><br>${id}`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('jwt_access_token');
        dispatch(apagarRecados(id)); // Aqui depatch no thank API
        dispatch(deleteJ(id)); // Aqui o despatch do redux toolikt
      } else if (result.isDenied) {
        MySwal.fire('Registro não foi apagado!', '', 'info');
      }
    });
  }

  function editar(id: any, dsc: any, recado: any) {
    console.log(id, dsc, recado);

    setId(id);
    setDescricao(dsc);
    setRecado(recado);
    setAcao('Editar');
    setAbrirModal(true);
  }

  return (
    <div>
      <Typography variant="h3" align="center">
        SISTEMA DE RECADOS
      </Typography>
      <Button variant="outlined" sx={{ ml: 135 }} onClick={novorecado}>
        NOVO RECADO
      </Button>
      <Container sx={{ mt: 5 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell># ID</TableCell>
                <TableCell align="center">Descrição</TableCell>
                <TableCell align="center">Recado</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aux.length !== 0 &&
                aux.map((row: any, index: any) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.description}</TableCell>
                    <TableCell align="center">{row.detail}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => editar(`${row.id}`, `${row.description}`, `${row.detail}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => apagar(`${row.id}`)}
                        sx={{ ml: 2 }}
                      >
                        Apagar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <TesteHeader
        abrir={abrirmodal}
        fechar={fecharModal}
        acao={acao}
        id={id}
        rec={recado}
        des={descricao}
      />
    </div>
  );
};

export default Teste;
