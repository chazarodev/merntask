import React, {useReducer} from 'react';
import TareaContext from './tareaContext';
import tareaReducer from './tareaReducer';
// import {v4 as uuidv4} from 'uuid';
import {
        TAREAS_PROYECTO,
        AGREGAR_TAREA,
        VALIDAR_TAREA,
        ELIMINAR_TAREA,
        TAREA_ACTUAL,
        ACTUALIZAR_TAREA,
        LIMPIAR_TAREA
    } from '../../types'; 
import clienteAxios from '../../config/axios';

const TareaState = props => {
    const initialState = {

        //Mantengo el código comentado a base de ejemplo 
        // tareas: [
        //     {id:1, nombre: 'Elegir Plataforma', estado: true, proyectoId: 1},
        //     {id:2, nombre: 'Elegir Colores', estado: false, proyectoId: 2},
        //     {id:3, nombre: 'Elegir Plataforma de pago', estado: false, proyectoId: 3},
        //     {id:4, nombre: 'Elegir Hosting', estado: true, proyectoId: 4},
        //     {id:5, nombre: 'Elegir Plataforma', estado: true, proyectoId: 1},
        //     {id:6, nombre: 'Elegir Colores', estado: false, proyectoId: 2},
        //     {id:7, nombre: 'Elegir Plataforma de pago', estado: false, proyectoId: 3},
        //     {id:8, nombre: 'Elegir Hosting', estado: true, proyectoId: 4},
        //     {id:9, nombre: 'Elegir Plataforma', estado: true, proyectoId: 1},
        //     {id:10, nombre: 'Elegir Colores', estado: false, proyectoId: 2},
        // ],

        tareasproyecto: [],
        errortarea: false,
        tareaSeleccionada: null 
    };

    //Crear dispatch y state
    const [state, dispatch] = useReducer(tareaReducer, initialState);

    //Crear las funciones


    //Obtener las tareas de un proyecto
    const obtenerTareas = async proyecto => {
        try {
            const resultado = await clienteAxios.get('/api/tareas', {params: {proyecto}});
            dispatch({
                type: TAREAS_PROYECTO,
                payload: resultado.data.tareas
            });
        } catch (error) {
            console.log(error);
        };
    };

    //Agregar una tarea al proyecto seleccionado
    const agregarTarea = async tarea => {
        // tarea.id = uuidv4(); Ya no se requiere debido a que Mongo coloca el _id
        try {
            const resultado = await clienteAxios.post('/api/tareas', tarea);
            console.log(resultado);
            dispatch({
                type: AGREGAR_TAREA,
                payload: tarea
            });
        } catch (error) {
            console.log(error);
        };
    };

    //Valida y muestra un error en caso de ser necesario
    const validarTarea = () => {
        dispatch({
            type: VALIDAR_TAREA
        });
    };

    //Eliminar tarea por id
    const eliminarTarea = async (id, proyecto) => {
        try {
            await clienteAxios.delete(`/api/tareas/${id}`, {params: {proyecto}});
            dispatch({
                type: ELIMINAR_TAREA,
                payload: id
            });
        } catch (error) {
            console.log(error);
        }
    };

    //Cambia el estado de cada tarea
    const actualizarTarea = async tarea => {
        try {
            const resultado = await clienteAxios.put(`/api/tareas/${tarea._id}`, tarea);
            dispatch({
                type: ACTUALIZAR_TAREA,
                payload: resultado.data.tarea
            }); 
        } catch (error) {
            console.log(error);
        };
    };

    //Extrae una tarea para edición
    const guardarTareaActual = tarea =>{
        dispatch({
            type: TAREA_ACTUAL,
            payload: tarea
        });
    };

    //Edita o modifica una tarea - La función se elimina ya que es similiar a cambiar estado de tarea
    // const actualizarTarea = tarea => {
    //     dispatch({
    //         type: ACTUALIZAR_TAREA,
    //         payload: tarea
    //     });
    // };

    //Elimina la tarea seleccionada
    const limpiarTarea = () => {
        dispatch({
            type: LIMPIAR_TAREA
        });
    }; 

    return (
        <TareaContext.Provider
            value={{
                // tareas: state.tareas, Se elimina tareas del state
                tareasproyecto: state.tareasproyecto,
                errortarea: state.errortarea,
                tareaSeleccionada: state.tareaSeleccionada,
                obtenerTareas, 
                agregarTarea,
                validarTarea,
                eliminarTarea,
                guardarTareaActual,
                actualizarTarea,
                limpiarTarea
            }}
        >
            {props.children}
        </TareaContext.Provider>
    );
};

export default TareaState;