import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, TextField } from '@mui/material';
import { useAppDispatch } from 'app/store/hooks';
import { editarRecados, novoRecados, updateJ } from './store/recSlice';

interface IModal {
  abrir: boolean;
  fechar: () => void;
  acao: string;
  id?: string;
  des?: string;
  rec?: string;
}

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

const TesteHeader: React.FC<IModal> = ({ abrir, fechar, acao, id, des, rec }) => {
  React.useEffect(() => {
    setOpen(abrir);
  }, [abrir]);

  const [open, setOpen] = React.useState(false);
  const [descricao, setDescricao] = React.useState<string | undefined>('');
  const [recado, setRecado] = React.useState<string | undefined>('');

  const dispatch = useAppDispatch();
  React.useEffect(() => {
    setDescricao(des);
    setRecado(rec);
  }, [des, rec]);

  const novoRecado = () => {
    const token = localStorage.getItem('jwt_access_token') || '';
    const postData = {
      description: descricao,
      detail: recado,
      token,
    };

    dispatch(novoRecados(postData));

    handleClose();
  };

  function editar(idx: any) {
    const token = localStorage.getItem('jwt_access_token') || '';
    const postData = {
      id: idx,
      description: descricao,
      detail: recado,
      token,
    };

    dispatch(editarRecados(postData));
    dispatch(updateJ({ id: idx, changes: postData }));

    handleClose();
  }

  const handleClose = () => {
    fechar();
    setOpen(false);
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {acao === 'Novo Recado' && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {acao}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <TextField
                  label="Descri????o"
                  id="filled-size-small"
                  defaultValue=""
                  variant="filled"
                  size="small"
                  fullWidth
                  onChange={(e) => setDescricao(e.target.value)}
                />
                <TextField
                  label="Recado"
                  id="filled-size-small"
                  defaultValue=""
                  variant="filled"
                  size="small"
                  sx={{ mt: 2 }}
                  fullWidth
                  onChange={(e) => setRecado(e.target.value)}
                />
              </Typography>
              <Button onClick={novoRecado} variant="outlined" sx={{ mt: 2, ml: 30 }}>
                {' '}
                Salvar
              </Button>
            </>
          )}
          {acao === 'Editar' && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {acao}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <TextField
                  label="Descri????o"
                  id="filled-size-small"
                  value={descricao}
                  variant="filled"
                  size="small"
                  fullWidth
                  onChange={(e) => setDescricao(e.target.value)}
                />
                <TextField
                  label="Recado"
                  id="filled-size-small"
                  value={recado}
                  variant="filled"
                  size="small"
                  sx={{ mt: 2 }}
                  fullWidth
                  onChange={(e) => setRecado(e.target.value)}
                />
              </Typography>

              <Button onClick={() => editar(id)} variant="outlined" sx={{ mt: 2, ml: 30 }}>
                {' '}
                Editar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default TesteHeader;
