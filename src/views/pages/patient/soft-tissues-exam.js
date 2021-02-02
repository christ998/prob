import React, { useState, useEffect, Suspense } from 'react'
import Axios from '../../../helpers/axiosConfig'
import { Button, ButtonGroup, ButtonToolbar, Tooltip } from 'reactstrap'
import { Canvas } from "react-three-fiber";
import AddMarkerForm from '../../../components/Fantoma/FormsExams/AddMarkerForm'
import EditMarkerForm from '../../../components/Fantoma/FormsExams/EditMarkerForm'
import MarkersGroup from '../../../components/Fantoma/Tag/MarkersGroup'
import CameraControls from '../../../components/Fantoma/CameraControls'
import MouseHelper  from '../../../components/Fantoma/MouseHelper'
import FantomaIntraOral  from '../../../components/Fantoma/FantomaIntraOral'
import { Link } from 'react-router-dom';

const SoftTissuesExam = ({location}) => {
    const typeExam="soft-tissues-exam"

    const [positionHelper, setPositionHelper]= useState()
    const [orientationHelper, setOrientationHelper]= useState()

    const [canvasSize, setCanvasSize] = useState({height: undefined}); 
    const [rSelected, setRSelected] = useState(null);

    const [visibilityHelper, setVisibilityHelper] = useState(false) 
    
    const initialFormState = { 
        id: null, 
        idAnamnesis: null,
        form: null,
        length: null,
        width: null,
        height: null,
        color: null,
        surface: null,
        consistency: null,
        evolution_time: null,
        evolution_form: null,
        symptomatology: null,
        edge: null,
        localization: null,
        observation: '',
        position_x: null,
        position_y: null,
        position_z: null,
        orientation_x: null,
        orientation_y: null,
        orientation_z: null          
    }

    const getPositionHelper = (positionHelper) => {
        setPositionHelper(positionHelper)
    }
    const getOrientationHelper = (orientationHelper) => {
        setOrientationHelper(orientationHelper)
    }
  
    const [markers, setMarkers] = useState([])
    const [currentMarker, setCurrentMarker ] = useState(initialFormState)
    
    const [adding, setAdding ] = useState(false)
    const [editing, setEditing ] = useState(false)

    const [addTooltipOpen, setAddTooltipOpen] = useState(false);
    const [editTooltipOpen, setEditTooltipOpen] = useState(false);
/*     
    const [moveTooltipOpen, setMoveTooltipOpen] = useState(false);
    const [rotateTooltipOpen, setRotateTooltipOpen] = useState(false);
    const [scaleTooltipOpen, setScaleTooltipOpen] = useState(false);
 */
    const addToggle = () => setAddTooltipOpen(!addTooltipOpen);
    const editToggle = () => setEditTooltipOpen(!editTooltipOpen);
/*  
    const moveToggle = () => setMoveTooltipOpen(!moveTooltipOpen);
    const rotateToggle = () => setRotateTooltipOpen(!rotateTooltipOpen);
    const scaleToggle = () => setScaleTooltipOpen(!scaleTooltipOpen);
 */

    const getMarkers = async () => {
        const newMarkers = [] 
        await Axios.get("soft-tissues-exam/" + location.state.anamId)
        
        .then(response => {
            setMarkers([])
            response.data.result.forEach(element => {
                newMarkers.push({
                    id: element.soft_tissues_exam_id,
                    idAnamnesis: location.state.anamId, 
                    form: element.form_id,     
                    length:element.length, 
                    width:element.width, 
                    height:element.height, 
                    color:element.color_id, 
                    surface:element.surface_id, 
                    consistency:element.consistency_id, 
                    evolution_time:element.evolution_time,
                    evolution_form:element.evolution_form_id, 
                    symptomatology:element.symptomatology_id, 
                    edge: element.edge_id,
                    localization:element.localization_id, 
                    observation:element.observation, 
                    position_x:element.position_x, 
                    position_y:element.position_y, 
                    position_z:element.position_z,
                    orientation_x:element.orientation_x, 
                    orientation_y:element.orientation_y, 
                    orientation_z:element.orientation_z   
                });
                setMarkers([...newMarkers])   
            });
        })  
    }


    const helperAddMarker = ()=>{
        if(rSelected===1){
            setAdding(true)
        }
    }


    const addMarker = async (marker) => {
        if(rSelected===1){
            setAdding(true)
            const res = await Axios.post("soft-tissues-exam",
                {
                    dentalAnamnesisId : location.state.anamId,
                    formId : marker.form ,
                    length: marker.length,
                    width: marker.width,
                    height: marker.height,
                    colorId : marker.color,
                    surfaceId : marker.surface,
                    consistencyId : marker.consistency,
                    evolutionTime : marker.evolution_time,
                    evolutionFromId : marker.evolution_form,
                    symptomatologyId: marker.symptomatology,
                    edgeId: marker.edge,
                    localizationId: marker.localization,
                    observation: marker.observation,
                    position_x: positionHelper.x,
                    position_y: positionHelper.y,
                    position_z: positionHelper.z,
                    orientation_x: orientationHelper.x,
                    orientation_y: orientationHelper.y,
                    orientation_z: orientationHelper.z
                }
		    )
            if (!res.data.error){
                //alert("Etiqueta guardada")
                setMarkers([ ...markers, marker ])
                getMarkers()
            }
        }
        setAdding(false)
	}

    const deleteMarker = async (id) => {

        setEditing(false)
        const res = await Axios.delete("soft-tissues-exam/" + id);
        if (!res.data.error) {
            setMarkers(markers.filter(marker => marker.id !== id))
            getMarkers()
            //alert("Etiqueta eliminada")
        }
    }
    
    const updateMarker = async (id, updatedMarker) => {
        setEditing(false)
        const res = await Axios.put("soft-tissues-exam",
            {
                dentalAnamnesisId : location.state.anamId,
                formId : updatedMarker.form ,
                length: updatedMarker.length,
                width: updatedMarker.width,
                height: updatedMarker.height,
                colorId : updatedMarker.color,
                surfaceId : updatedMarker.surface,
                consistencyId : updatedMarker.consistency,
                evolutionTime : updatedMarker.evolution_time,
                evolutionFromId : updatedMarker.evolution_form,
                symptomatologyId: updatedMarker.symptomatology,
                edgeId: updatedMarker.edge,
                localizationId: updatedMarker.localization,
                observation: updatedMarker.observation,
                position_x: updatedMarker.position_x,
                position_y: updatedMarker.position_y,
                position_z: updatedMarker.position_z,
                orientation_x:updatedMarker.orientation_x, 
                orientation_y:updatedMarker.orientation_y, 
                orientation_z:updatedMarker.orientation_z,
                softTissuesExamId: id
            }
        )
        if (!res.data.error){
		    setMarkers(markers.map(marker => (marker.id === id ? updatedMarker : marker)))
            getMarkers()
            //alert("Etiqueta actualizada")
        }
	}

    const editMarker = marker => {
		setEditing(true)
        setCurrentMarker({ 
            id: marker.id, 
            idAnamnesis: marker.idAnamnesis,
            form: marker.form,
            length: marker.length,
            width: marker.width,
            height: marker.height,
            color: marker.color,
            surface: marker.surface,
            consistency: marker.consistency,
            evolution_time: marker.evolution_time,
            evolution_form: marker.evolution_form,
            symptomatology: marker.symptomatology,
            edge: marker.edge,
            localization: marker.localization,
            observation: marker.observation,
            position_x: marker.position_x,
            position_y: marker.position_y,
            position_z: marker.position_z,
            orientation_x: marker.orientation_x,
            orientation_y: marker.orientation_y,
            orientation_z: marker.orientation_z
        })
    }


    useEffect(() => {
		const navbarSize = document.getElementsByClassName('navbar-top')[0];
		const footerSize = document.getElementsByClassName('footer')[0];
		const handleResize = () => {
			setCanvasSize({
				width: window.innerWidth - navbarSize.offsetWidth - footerSize.offsetWidth,
				height: window.innerHeight - navbarSize.offsetHeight - footerSize.offsetHeight
			});
		}
		window.addEventListener("resize", handleResize);
        handleResize();
        
        getMarkers()
        return () => window.removeEventListener("resize", handleResize); 
	}, []);
    

    return (
        <>
        <ButtonToolbar style={{ zIndex: 100, position: 'absolute', top:'90%', left:'50%', transform:'translate(-50%, -50%)' }}>
            <ButtonGroup>
				<Button color="primary" size="lg" onClick={() => setRSelected(1)} active={rSelected === 1} id="add">
                    <i className="fas fa-tags"></i>
                </Button>
                    <Tooltip
                        placement="top"
                        isOpen={addTooltipOpen}
                        target={"add"}
                        toggle={addToggle}
                    >
                        Añadir marcador
                    </Tooltip>
				<Button color="primary" size="lg" onClick={() => setRSelected(2)} active={rSelected === 2} id="edit">
                    <i className="ni ni-active-40"></i>
                </Button>
                    <Tooltip
                        placement="top"
                        isOpen={editTooltipOpen}
                        target={"edit"}
                        toggle={editToggle}
                    >
                        Abrir marcador
                    </Tooltip>
			</ButtonGroup>
{/*             <ButtonGroup>
                <Button color="primary" size="lg" onClick={() => setRSelected(3)} active={rSelected === 3} id="move">
                    <MoveIcon className="fas"/>
                </Button>
                <Tooltip
                        placement="top"
                        isOpen={moveTooltipOpen}
                        target={"move"}
                        toggle={moveToggle}
                    >
                        Mover lesión
                </Tooltip>
                <Button color="primary" size="lg" onClick={() => setRSelected(4)} active={rSelected === 4} id="rotate">
                    <RotateIcon className="fas"/>
                </Button>
                <Tooltip
                        placement="top"
                        isOpen={rotateTooltipOpen}
                        target={"rotate"}
                        toggle={rotateToggle}
                    >
                        Rotar lesión
                </Tooltip>
                <Button color="primary" size="lg" onClick={() => setRSelected(5)} active={rSelected === 5} id="scale">
                    <ScaleIcon className="fas"/>
                </Button>
                <Tooltip
                        placement="top"
                        isOpen={scaleTooltipOpen}
                        target={"scale"}
                        toggle={scaleToggle}
                    >
                        Escalar lesión
                </Tooltip>
            </ButtonGroup>   */}
        </ButtonToolbar>
            <ButtonGroup style={{ zIndex: 100, position: 'absolute', top:'90%', left:'95%', transform:'translate(-100%, -50%)' }}>
                <Button color="primary" size="lg"><Link style={{color: "white"}} to={{
                    state: {
                        id: location?.state?.id,
                        run: location?.state?.run,
                        name: location?.state?.name,
                        apellido: location?.state?.apellido,
                        anamId: location?.state?.anamId
                    },
                    pathname: "/admin/extra-oral"
                    }}>Extra Oral</Link>
                </Button>
                <Button color="primary" active size="lg">Tejidos Blandos</Button>
                <Button color="primary" size="lg"><Link style={{color: "white"}} to={{
                    state: {
                        id: location?.state?.id,
                        run: location?.state?.run,
                        name: location?.state?.name,
                        apellido: location?.state?.apellido,
                        anamId: location?.state?.anamId
                    },
                    pathname: "/admin/odontogram"
                    }}>Odontograma</Link>
                </Button>
                <Button color="info" size="lg"><Link style={{color: "white"}} to={{
                    state: {
                        id: location?.state?.id,
                        run: location?.state?.run,
                        name: location?.state?.name,
                        apellido: location?.state?.apellido
                    },
                    pathname: "/admin/periodontogram"
                    }}>Periodontograma</Link>
                </Button>
            </ButtonGroup>

            {editing ? (
                <EditMarkerForm
                    editing={editing}
                    setEditing={setEditing}
                    currentMarker={currentMarker}
                    updateMarker={updateMarker}
                />
            ) : (
                <AddMarkerForm
                    adding={adding}
                    setAdding={setAdding} 
                    addMarker={addMarker} 
                />
            )}
            <Canvas className="canvas"
				gl={{ antialias: true }}
				shadowMap
				pixelRatio={window.devicePixelRatio}
				style={{ height: canvasSize.height, cursor: visibilityHelper ? ('crosshair'):('default') }}
				camera={{ fov: 55, position: [0, 0, 10] }}
			>
				<CameraControls minDistance={0.5} maxDistance={1.5}/>
				<spotLight intensity={0.4} position={[300, 300, 2000]} castShadow={true} />
				<spotLight intensity={0.35} position={[-3000, 1300, -1000]} castShadow={true} />
				<ambientLight intensity={0.07} />
				<Suspense fallback="loading">
                {rSelected === 1 ? (<MouseHelper visibility={false} handlePosition={getPositionHelper}  handleOrientation={getOrientationHelper} typeExam={typeExam}/>):(<></>)}
					{/* <MouseHelper visibility={visibilityHelper} handlePosition={getPositionHelper}/> */}
					<FantomaIntraOral scale={[10, 10, 10]} position={[0, 0, 0]} onDoubleClick={helperAddMarker} onPointerOver={() => setVisibilityHelper(true)} onPointerOut={() => setVisibilityHelper(false)} />
                    <MarkersGroup markers={markers} editMarker={editMarker} deleteMarker={deleteMarker} orientationHelper={orientationHelper} positionHelper={positionHelper} adding={rSelected} />	
				</Suspense>
				{/* <Stats /> */}
			</Canvas>
        </>
    )
}
export default SoftTissuesExam

/* const MoveIcon =()=> {
    return(
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1rem"
            height="1rem"
            x="0"
            y="0"
            enableBackground="new 0 0 492.001 492.001"
            version="1.1"
            viewBox="0 0 492.001 492.001"
            xmlSpace="preserve"
        >
            <path 
            fill='white'
            d="M487.97 237.06l-58.82-58.82c-5.224-5.228-14.376-5.228-19.592 0l-7.436 7.432c-5.4 5.4-5.4 14.064 0 19.46l21.872 21.74H265.206V68.396l21.808 22.132c5.224 5.22 14.216 5.22 19.428 0l7.36-7.432c5.404-5.404 5.356-14.196-.044-19.596L254.846 4.444c-2.6-2.592-6.088-4.184-9.804-4.184h-.404c-3.712 0-7.188 1.588-9.784 4.184l-57.688 57.772c-2.612 2.608-4.052 6.124-4.052 9.836 0 3.704 1.44 7.208 4.052 9.816l7.432 7.444c5.224 5.22 14.612 5.228 19.828.004l22.368-22.132v159.688H67.814l22.14-22.008c2.608-2.608 4.048-6.028 4.048-9.732s-1.44-7.16-4.052-9.76l-7.436-7.42c-5.22-5.216-14.372-5.2-19.584.008L4.034 236.856c-2.672 2.672-4.1 6.244-4.032 9.92-.068 3.816 1.356 7.388 4.028 10.056l57.68 57.692c5.224 5.22 14.38 5.22 19.596 0l7.44-7.44a13.75 13.75 0 004.044-9.788c0-3.716-1.44-7.232-4.044-9.836l-22.14-22.172H226.79V425.32l-23.336-23.088c-5.212-5.22-14.488-5.22-19.7 0l-7.5 7.44a13.778 13.778 0 00-4.072 9.792c0 3.704 1.424 7.184 4.028 9.792l58.448 58.456c2.596 2.592 6.068 4.028 9.9 4.028.024-.016.24 0 .272 0 3.712 0 7.192-1.432 9.792-4.028l58.828-58.832a13.782 13.782 0 004.044-9.792c0-3.712-1.44-7.192-4.044-9.796l-7.44-7.44c-5.216-5.22-14.044-5.22-19.264 0l-21.54 21.868V265.284H425.59l-23.096 23.132c-2.612 2.608-4.048 6.112-4.048 9.82s1.432 7.192 4.048 9.8l7.44 7.444c5.212 5.224 14.372 5.224 19.584 0l58.452-58.452a13.633 13.633 0 004.028-9.916c.072-3.816-1.356-7.384-4.028-10.052z"></path>
        </svg>
    )
}
const RotateIcon =()=> {
    return(
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
		height="1rem"
        x="0"
        y="0"
        enableBackground="new 0 0 512.25 512.25"
        version="1.1"
        viewBox="0 0 512.25 512.25"
        xmlSpace="preserve"
      >
        <path
        fill='white' 
        d="M256.13.125c-78.9 0-150.399 37-197.199 93.1l-19.2-18.9c-3.9-4.2-9.901-5.7-15.3-3.6-5.4 1.5-9.3 6.299-9.901 11.999l-14.399 99c-1.626 12.188 12.431 19.135 17.1 16.8l99-14.099c5.7-.601 10.201-4.501 12.001-9.901 1.8-5.4.599-11.4-3.6-15.599l-22.8-22.8c35.7-45.601 92.199-75 154.3-75 107.1 0 195.7 87.299 196 194.399v.601c0 3.814-.126 7.63-.363 11.413-.591 9.487 7.701 17.161 17.159 15.778l30.236-4.426c7.167-1.049 12.572-7.07 12.821-14.308.097-2.842.147-5.674.147-8.458C512.13 115.676 397.209.125 256.13.125zM495.03 310.725l-99 14.099c-5.7.601-10.201 4.501-12.001 9.901s-.599 11.4 3.6 15.601l24.001 24c-35.402 46.5-92.501 76.8-155.501 76.8-107.401 0-196-87.601-196-195 .101-1.952-.242-6.154.416-14.141.791-9.622-7.582-17.43-17.043-16.097l-30.231 4.255C6.13 231.15.701 237.099.377 244.306 0 252.662.17 259.392.13 262.424c3.3 137.701 117.4 249.701 256 249.701 79.799 0 151.901-37.601 198.701-94.9l17.699 17.699c3.94 4.378 10.488 5.526 15.3 3.6 5.4-1.5 9.3-6.299 9.901-11.999l14.399-99c1.24-9.287-7.333-18.429-17.1-16.8z"></path>
      </svg>
    )
}
const ScaleIcon =()=> {
    return(
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        x="0"
		y="0"
        viewBox="0 0 512 512"
      >
        <path 
        fill='white'
        d="M496.387 0H67.747c-8.63 0-15.618 6.996-15.618 15.613v276.239H15.613C6.996 291.852 0 298.836 0 307.465v188.922C0 505.004 6.996 512 15.613 512h188.922c8.63 0 15.613-6.996 15.613-15.613V459.87h276.239c8.617 0 15.613-6.988 15.613-15.617V15.614C512 6.995 505.004 0 496.387 0zM188.922 480.773H31.227V323.078h135.605l-72.586 72.586c-6.09 6.102-6.09 15.988 0 22.078 6.094 6.094 15.969 6.121 22.09 0l72.586-72.586zm291.851-52.132H220.148V313.93l121.73-121.73v62.456c0 8.63 6.985 15.614 15.614 15.614 8.621 0 15.613-6.985 15.613-15.614V154.508c0-8.906-7.28-15.613-15.613-15.613H257.344c-8.63 0-15.614 6.992-15.614 15.613 0 8.629 6.985 15.613 15.614 15.613H319.8l-121.738 121.73H83.359V31.228h397.414zm0 0"></path>
      </svg>
    )
} */