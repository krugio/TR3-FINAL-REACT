import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../../../services/tasks-list-api';

export interface IRecado {
  id: string;
  description: string;
  detail: string;
}

export const buscaRecados = createAsyncThunk('recados/buscarTodos', async (token: string) => {
  const dados = await api
    .get(`/task/readTasksByUserId?token=${token}`)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  if (!dados.ok) {
    return [];
  }

  return dados.data; // PAYLOAD
});

export const novoRecados = createAsyncThunk('recados/Novo', async (recado: any) => {
  const dados = await api
    .post(`/task/`, recado)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  if (!dados.ok) {
    return [];
  }

  console.log(dados.data);
  return dados.data; // PAYLOAD
});

export const apagarRecados = createAsyncThunk('recados/apagar', async (id: any) => {
  const token = localStorage.getItem('jwt_access_token');
  const dados = await api
    .delete(`/task/${id}?token=${token}`)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  if (!dados.ok) {
    return [];
  }

  console.log(dados.data);
  return dados.data; // PAYLOAD
});

export const editarRecados = createAsyncThunk('recados/editar', async (recs: any) => {
  const dados = await api
    .put(`/task/`, recs)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  if (!dados.ok) {
    return [];
  }

  return dados.data; // PAYLOAD
});

const adapter = createEntityAdapter<IRecado>({
  selectId: (item) => item.id,
});

export const { selectAll, selectById } = adapter.getSelectors((state: RootState) => state.recSlice);

const recSlice = createSlice({
  name: 'recSlice',
  initialState: adapter.getInitialState(),
  reducers: {
    updateJ: adapter.updateOne,
    deleteJ: adapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(buscaRecados.fulfilled, (state, action) => {
      adapter.setAll(state, action.payload);
    });

    builder.addCase(novoRecados.fulfilled, (state, action) => {
      const MySwal = withReactContent(Swal);
      MySwal.fire('Recado adicionado com sucesso!', '', 'success');
      adapter.addOne(state, action.payload);
    });

    builder.addCase(apagarRecados.fulfilled, (state, action) => {
      const MySwal = withReactContent(Swal);
      MySwal.fire('Recado excluido com sucesso!', '', 'success');
      adapter.removeOne(state, action.payload);
    });

    builder.addCase(editarRecados.fulfilled, (state, action) => {
      const MySwal = withReactContent(Swal);
      MySwal.fire('Recado editado com sucesso!', '', 'success');
    });
  },
});

export const { deleteJ, updateJ } = recSlice.actions;
export default recSlice.reducer;
