import React, { useReducer } from 'react';
import ProyectoContext from './proyectoContext';
import proyectoReducer from './proyectoReducer';
// import {v4 as uuidv4} from 'uuid'; Quitamos la dependencia para el id
import { 
        FORMULARIO_PROYECTO, 
        OBTENER_PROYECTOS, 
        AGREGAR_PROYECTO, 
        PROYECTO_ERROR,
        VALIDAR_FORMULARIO ,
        PROYECTO_ACTUAL,
        ELIMINAR_PROYECTO,
} from '../../types';
import clienteAxios from '../../config/axios';

const ProyectoState = props => {

    // Agregamos proyectos en memoria para el desarrollo del proyecto, sin embar, ya vendrán de la base de datos
    // const proyectos = [
    //     {id: 1, nombre: 'Tienda Virtual'},
    //     {id: 2, nombre: 'intranet'},
    //     {id: 3, nombre: 'diseño de sitio web'},
    //     {id: 4, nombre: 'MERN'},
    // ]; 

    const initialState = {
        proyectos: [],
        formulario: false,
        errorFormulario: false,
        proyecto: null,
        mensaje: null
    };

    //Dispatch para ejecutar las acciones
    const [state, dispatch] = useReducer(proyectoReducer, initialState)

    //Serie de funciones para el CRUD de proyectos
    const mostrarFormulario = () => {
        dispatch({
            type: FORMULARIO_PROYECTO
        });
    };

    //Obtener los proyectos
    const obtenerProyectos = async () => {
        try {
            const resultado = await clienteAxios.get('/api/proyectos');
            dispatch({
                type: OBTENER_PROYECTOS,
                payload: resultado.data.proyectos
            });
        } catch (error) {
            const alerta = {
                msg: 'Hubo un error',
                categoria: 'alerta-error'
            };
            dispatch({
                type: PROYECTO_ERROR,
                payload: alerta
            });
        }
    };

    //Agregar nuevo proyecto
    const agregarProyecto = async proyecto => {
        // proyecto.id = uuidv4(); Quitamos el id ya que mongo se encarga de agregarlo

       try {
           const resultado = await clienteAxios.post('/api/proyectos', proyecto);
           console.log(resultado);
            //Insertar el proyecto en el state
            dispatch({
                type: AGREGAR_PROYECTO,
                payload: resultado.data
            });
       } catch (error) {
            const alerta = {
                msg: 'Hubo un error',
                categoria: 'alerta-error'
            };
            dispatch({
                type: PROYECTO_ERROR,
                payload: alerta
            }); 
        }
    };

    //Valida el formulario por errores
    const mostrarError = () => {
        dispatch({
            type: VALIDAR_FORMULARIO,
        });
    };

    //Selecciona el proyecto que el usuario dio click
    const proyectoActual = proyectoId => {
        dispatch({
            type: PROYECTO_ACTUAL,
            payload: proyectoId
        });
    };

    //Elimina un proyecto
    const eliminarProyecto = async proyectoId => {
        try {
            await clienteAxios.delete(`/api/proyectos/${proyectoId}`);
            dispatch({
                type: ELIMINAR_PROYECTO,
                payload: proyectoId
            });
        } catch (error) {
            const alerta = {
                msg: 'Hubo un error',
                categoria: 'alerta-error'
            };
            dispatch({
                type: PROYECTO_ERROR,
                payload: alerta
            });
        };
    };

    return(
        <ProyectoContext.Provider
            value={{
                proyectos: state.proyectos,
                errorFormulario: state.errorFormulario,
                proyecto: state.proyecto,
                formulario: state.formulario,
                mensaje: state.mensaje,
                mostrarFormulario,
                obtenerProyectos,
                agregarProyecto,
                mostrarError,
                proyectoActual,
                eliminarProyecto
            }}
        >
            {props.children}
        </ProyectoContext.Provider>
    );
};

export default ProyectoState;
