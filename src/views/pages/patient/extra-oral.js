import React, { useState, useEffect, Suspense } from 'react'
import Axios from '../../../helpers/axiosConfig'
import { Button, ButtonGroup, ButtonToolbar, Tooltip } from 'reactstrap'
import AddExtraOralForm from '../../../components/Fantoma/FormsExams/AddExtraOralForm'
import EditExtraOralForm from '../../../components/Fantoma/FormsExams/EditExtraOralForm'
import MarkersGroupExtraOral from '../../../components/Fantoma/Tag/MarkersGroupExtraOral'
import { Canvas } from "react-three-fiber";
import CameraControls from '../../../components/Fantoma/CameraControls'
import MouseHelper  from '../../../components/Fantoma/MouseHelper'
import FantomaExtraOral  from '../../../components/Fantoma/FantomaExtraOral'
import { Link } from 'react-router-dom';


const ExtraOral = ({location}) => {

    const [positionHelper, setPositionHelper]= useState()

    const [canvasSize, setCanvasSize] = useState({height: undefined}); 
    const [rSelected, setRSelected] = useState(null);

    const [visibilityHelper, setVisibilityHelper] = useState(false) 
    
    const initialFormState = { 
        id: null, 
        idAnamnesis: null,
        inspection: '',
        palpation: '',
        position_x: null,
        position_y: null,
        position_z: null        
    }

    const getPositionHelper = (positionHelper) => {
        setPositionHelper(positionHelper)
    }

    const [markers, setMarkers] = useState([])
    const [currentMarker, setCurrentMarker ] = useState(initialFormState)
    const [adding, setAdding ] = useState(false)
    const [editing, setEditing ] = useState(false)

    const [addTooltipOpen, setAddTooltipOpen] = useState(false);
    const [editTooltipOpen, setEditTooltipOpen] = useState(false);
    const addToggle = () => setAddTooltipOpen(!addTooltipOpen);
    const editToggle = () => setEditTooltipOpen(!editTooltipOpen);



    const getMarkers = async () => {
        const newMarkers = [] 
        const res = await Axios.get("extra-oral-exam/" + location.state.anamId)
        
        .then(response => {
            setMarkers([])
            response.data.result.forEach(element => {
                newMarkers.push({
                    id: element.extra_oral_exam_id,
                    idAnamnesis: location.state.anamId, 
                    inspection: element.inspection,
                    palpation: element.palpation,
                    position_x:element.position_x, 
                    position_y:element.position_y, 
                    position_z:element.position_z, 
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
            const res = await Axios.post("extra-oral-exam",
                {
                    dentalAnamnesisId : location.state.anamId,
                    inspection: marker.inspection,
                    palpation: marker.palpation,
                    position_x: positionHelper.x,
                    position_y: positionHelper.y,
                    position_z: positionHelper.z,
                }
		    )
            if (!res.data.error)
                //alert("Etiqueta guardada")
                setMarkers([ ...markers, marker ])
                getMarkers()
        }
        setAdding(false)
	}

    const updateMarker = async (id, updatedMarker) => {
        setEditing(false)
        const res = await Axios.put("extra-oral-exam",
            {
                dentalAnamnesisId : location.state.anamId,
                inspection: updatedMarker.inspection,
                palpation: updatedMarker.palpation,
                observation: updatedMarker.observation,
                position_x: updatedMarker.position_x,
                position_y: updatedMarker.position_y,
                position_z: updatedMarker.position_z,
                extraOralExamId: id
            }
        )
        if (!res.data.error){
		    setMarkers(markers.map(marker => (marker.id === id ? updatedMarker : marker)))
            getMarkers()
            //alert("Etiqueta guardada")
        }
	}

    const editMarker = marker => {
		setEditing(true)
        setCurrentMarker({ 
            id: marker.id, 
            idAnamnesis: marker.idAnamnesis,
            inspection: marker.inspection,
            palpation: marker.palpation,
            position_x: marker.position_x,
            position_y: marker.position_y,
            position_z: marker.position_z
        })
    }

    const deleteMarker = async (id) => {

        setEditing(false)
        const res = await Axios.delete("extra-oral-exam/" + id);
        if (!res.data.error) {
            setMarkers(markers.filter(marker => marker.id !== id))
            getMarkers()
            //alert("Etiqueta eliminada")
        }
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
				<Button color="primary" size="lg" onClick={() => setRSelected(1)} active={rSelected === 1} id="add"><i className="fas fa-tags" ></i></Button>
                    <Tooltip
                        placement="top"
                        isOpen={addTooltipOpen}
                        target={"add"}
                        toggle={addToggle}
                    >
                        Añadir etiqueta
                    </Tooltip>
				<Button color="primary" size="lg" onClick={() => setRSelected(2)} active={rSelected === 2} id="edit"><i className="ni ni-active-40" ></i></Button>
                <Tooltip
                        placement="top"
                        isOpen={editTooltipOpen}
                        target={"edit"}
                        toggle={editToggle}
                    >
                        Editar etiqueta
                    </Tooltip>
			</ButtonGroup>
        </ButtonToolbar>
            <ButtonGroup style={{ zIndex: 100, position: 'absolute', top:'90%', left:'95%', transform:'translate(-100%, -50%)' }}>
                <Button color="primary" active size="lg">Extra Oral</Button>
                <Button color="primary" size="lg"><Link style={{color: "white"}} to={{
                    state: {
                        id: location?.state?.id,
                        run: location?.state?.run,
                        name: location?.state?.name,
                        apellido: location?.state?.apellido,
                        anamId: location?.state?.anamId
                    },
                    pathname: "/admin/soft-tissues-exam"
                    }}>Tejidos Blandos</Link>
                </Button>
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
                        apellido: location?.state?.apellido,
                        anamId: location?.state?.anamId
                    },
                    pathname: "/admin/periodontogram"
                    }}>Periodontograma</Link>
                </Button>
            </ButtonGroup>

            {editing ? (
                <EditExtraOralForm
                    editing={editing}
                    setEditing={setEditing}
                    currentMarker={currentMarker}
                    updateMarker={updateMarker}
                />
            ) : (
                <AddExtraOralForm
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
				<CameraControls minDistance={1.3} maxDistance={3.5}/>
				<spotLight intensity={0.4} position={[300, 300, 2000]} castShadow={true} />
				<spotLight intensity={0.35} position={[-3000, 1300, -1000]} castShadow={true} />
				<ambientLight intensity={0.07} />
				<Suspense fallback="loading">
                {rSelected === 1 ?(<MouseHelper visibility={visibilityHelper} handlePosition={getPositionHelper}/>):(<></>)}
					<FantomaExtraOral scale={[10, 10, 10]} position={[0, 0, 0]} onDoubleClick={helperAddMarker} onPointerOver={() => setVisibilityHelper(true)} onPointerOut={() => setVisibilityHelper(false)}/>
                    <MarkersGroupExtraOral markers={markers} editMarker={editMarker} deleteMarker={deleteMarker} adding={rSelected} />	
				</Suspense>
				{/* <Stats /> */}
			</Canvas>
        </>
    )
}
export default ExtraOral