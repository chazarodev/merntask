import React, {useContext, useState, useEffect} from 'react';
import proyectoContext from '../../context/proyectos/proyectoContext';
import tareaContext from '../../context/tareas/tareaContext';

const FormTarea = () => {
    //Extraer si un proyecto está activo
    const proyectosContext = useContext(proyectoContext);
    const {proyecto} = proyectosContext;

    //Obtener la función del context de tarea
    const tareasContext = useContext(tareaContext);
    const {tareaSeleccionada, errortarea, agregarTarea, validarTarea, obtenerTareas, actualizarTarea, limpiarTarea} = tareasContext;

    //Effect que detecta si hay una tarea seleccionada
    useEffect(() => {
        if (tareaSeleccionada !== null) {
            guardarTarea(tareaSeleccionada);
        } else {
            guardarTarea({
                nombre: '',
            });
        };
    }, [tareaSeleccionada]);

    //State del formulario
    const [tarea, guardarTarea] = useState({
        nombre: '',
    });

    //Extraer el nombre del proyecto
    const {nombre} = tarea;

    //Si no hay proyecto seleccionado
    if(!proyecto) {
        return null;
    };

    //Array destructuring para extraer el proyecto actual
    const [proyectoActual] = proyecto;

    //Leer los valores del formulario
    const handleChange = e => {
        guardarTarea({
            ...tarea,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = e => {
        e.preventDefault();

        //Validar
        if (nombre.trim() === '') {
            validarTarea();
            return;
        };

        //Revisar si es edición o si es nueva tarea
        if (tareaSeleccionada === null) { //Tarea nueva
            //agregar nueva tarea al state de tareas
            tarea.proyecto = proyectoActual._id;
            //Reemplazo el .id por el _id de mongo 
            // tarea.estado = false; Ya no es necesario puesto que en el modelo de tarea ya está definido
            agregarTarea(tarea);
        } else {
            //actualizar tarea existente
            actualizarTarea(tarea);
            //Elimina tarea seleccionada del state
            limpiarTarea();
        };

        //Obtener y filtrar las tareas del proyecto
        obtenerTareas(proyectoActual.id);

        //Reiniciar el form
        guardarTarea({
            nombre: '',
        });
    };

    return (  
        <div className="formulario">
            <form onSubmit={onSubmit}>
                <div className="contenedor-input">
                    <input 
                        type="text" 
                        className="input-text"
                        placeholder="Nombre Tarea..."
                        name="nombre"
                        value={nombre}
                        onChange={handleChange}    
                    />
                </div>
                <div className="contenedor-input">
                    <input 
                        type="submit" 
                        className="btn btn-primario btn-submit btn-block"
                        value={tareaSeleccionada ? 'Editar Tarea' : 'Agregar Tarea' }   
                    />
                </div>
            </form>
            {errortarea ? <p className="mensaje error">El nombre de la tarea es obligatorio</p> :null}
        </div>
    );
}
 
export default FormTarea;
