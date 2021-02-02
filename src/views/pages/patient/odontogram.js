import React, { useState, useEffect, Suspense } from 'react'
import Axios from '../../../helpers/axiosConfig'
import { Button, ButtonGroup, ButtonToolbar, Tooltip } from 'reactstrap'
import { Canvas } from "react-three-fiber";
import CameraControls from '../../../components/Fantoma/CameraControls'
import FantomaOdontogram  from '../../../components/Fantoma/FantomaOdontogram'
import OdontogramModal  from '../../../components/Fantoma/FormsExams/OdontogramModal'
import { Link } from 'react-router-dom';

const Odontogram = ({location}) => {

    const [canvasSize, setCanvasSize] = useState({height: undefined}); 
    const resizeCanvas=()=>{
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
		return () => window.removeEventListener("resize", handleResize); 
    }
    
    const periodontogramUrl="periodontal url"
    
	const [gumOpacity, setGumOpacity] = useState(true)
	
    const [open, setOpen ] = useState(false)
    
	const [rSelected, setRSelected] = useState(null);

	const [piecesTooltipOpen, setPiecesTooltipOpen] = useState(false);
    const [opacityTooltipOpen, setOpacityTooltipOpen] = useState(false);

    const piecesToggle = () => setPiecesTooltipOpen(!piecesTooltipOpen);
    const opacityToggle = () => setOpacityTooltipOpen(!opacityTooltipOpen);

    const [odontogramId, setOdontogramId] = useState(0)
    const [teeth, setTeeth] = useState([])
    const [teethState, setTeethState] = useState([])
    const [currentTeeth, setCurrentTeeth ] = useState(initialTeethState)
    
	const initialTeethState = [
        {teeth_id: 1, teeth_state_id: 1},
        {teeth_id: 2, teeth_state_id: 1},
        {teeth_id: 3, teeth_state_id: 1},
        {teeth_id: 4, teeth_state_id: 1},
        {teeth_id: 5, teeth_state_id: 1},
        {teeth_id: 6, teeth_state_id: 1},
        {teeth_id: 7, teeth_state_id: 1},
        {teeth_id: 8, teeth_state_id: 1},
        {teeth_id: 9, teeth_state_id: 1},
        {teeth_id: 10, teeth_state_id: 1},
        {teeth_id: 11, teeth_state_id: 1},
        {teeth_id: 12, teeth_state_id: 1},
        {teeth_id: 13, teeth_state_id: 1},
        {teeth_id: 14, teeth_state_id: 1},
        {teeth_id: 15, teeth_state_id: 1},
        {teeth_id: 16, teeth_state_id: 1},
        {teeth_id: 17, teeth_state_id: 1},
        {teeth_id: 18, teeth_state_id: 1},
        {teeth_id: 19, teeth_state_id: 1},
        {teeth_id: 20, teeth_state_id: 1},
        {teeth_id: 21, teeth_state_id: 1},
        {teeth_id: 22, teeth_state_id: 1},
        {teeth_id: 23, teeth_state_id: 1},
        {teeth_id: 24, teeth_state_id: 1},
        {teeth_id: 25, teeth_state_id: 1},
        {teeth_id: 26, teeth_state_id: 1},
        {teeth_id: 27, teeth_state_id: 1},
        {teeth_id: 28, teeth_state_id: 1},
        {teeth_id: 29, teeth_state_id: 1},
        {teeth_id: 30, teeth_state_id: 1},
        {teeth_id: 31, teeth_state_id: 1},
        {teeth_id: 32, teeth_state_id: 1}
    ]	
    

    const handleCreateOdontogram =()=>{
        /* getOdontogram() */
        if (odontogramId === 0){
            addTeethStates(initialTeethState)
            console.log('odontograma creado')
        } 
        setOpen(true)
        /* getOdontogram() */
    }
   
    const addTeethStates = async (initialTeeth) => {
		const res = await Axios.post("odontogram",
			{
				dentalAnamnesisId : location.state.anamId,
				teethState: initialTeeth, 
				odontogramId: odontogramId,
				/* periodontogramUrl: periodontogramUrl */
			}
		)	
		if (!res.data.error)
        getOdontogramId()
        
    }

    const getOdontogramId = async () => {
        const res = await Axios.get("odontogram/" + location.state.anamId)
        .then(response => {
            if(response.data.result[0] !== undefined){
            setOdontogramId(response.data.result[0].odontogram_id)
            getTeethState(response.data.result[0].odontogram_id)
            }
        }) 
    }
 
	const updateOdontogram = async (id, updatedOdontogram) => {
        const res = await Axios.put("odontogram",
            {
                //dentalAnamnesisId : location.state.anamId,
                odontogramId: id,
                teethState: updatedOdontogram
                
            }
        )
        if (!res.data.error){
		    setTeeth(Object.values(updatedOdontogram))
            //getMarkers()
            //alert("Etiqueta actualizada")
        }
    }
   
    const getTeethState = async () => {
        const res = await Axios.get("odontogram/teeth/" + odontogramId).then(response => {
            if(response.data.result[0] !== undefined){
                console.log(response.data.result)
                setTeethState(response.data.result)
            }
        }) 
    } 
   
 	const deleteOdontogram = async (id) => {

        const res = await Axios.delete("odontogram/" + id);
        if (!res.data.error) {
            alert("Estado dental eliminado")
        }
    }

	useEffect(() => {
        resizeCanvas()
        getOdontogramId()
    
	}, []);

	return (
		<>
			<OdontogramModal open={open} setOpen={setOpen} updateOdontogram={updateOdontogram} teeth={teethState} odontogramId={odontogramId}/>

			<ButtonToolbar>
            <ButtonGroup style={{ zIndex: 100, position: 'absolute', top:'90%', left:'50%', transform:'translate(-50%, -50%)' }}>
				<Button onClick={() => handleCreateOdontogram()} color="primary" size="lg" id="pieces-selector"><i className="fas fa-tooth"></i>
                    <Tooltip
                        placement="top"
                        isOpen={piecesTooltipOpen}
                        target={"pieces-selector"}
                        toggle={() => piecesToggle()}
                    >
                        Selector de piezas
                    </Tooltip></Button>
                   
					<Button onClick={() => setGumOpacity(!gumOpacity)} color="primary" size="lg" id="opacity"><Icon className="fas"/></Button>
                    <Tooltip
                        placement="top"
                        isOpen={opacityTooltipOpen}
                        target={"opacity"}
                        toggle={() => opacityToggle()}
                    >
                        Opacidad
                    </Tooltip> 
			</ButtonGroup>
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
                <Button color="primary" active size="lg">Odontograma</Button>
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
        </ButtonToolbar>


			<Canvas className="canvas"
				gl={{ antialias: true }}
				shadowMap
				pixelRatio={window.devicePixelRatio}
				style={{ height: canvasSize.height }}
				camera={{ fov: 55, position: [0, 0, 10] }}
			>
				<CameraControls minDistance={0.5} maxDistance={1.5}/>
				<spotLight intensity={0.4} position={[300, 300, 2000]} castShadow={true} />
				<spotLight intensity={0.35} position={[-3000, 1300, -1000]} castShadow={true} />
				<ambientLight intensity={0.07} />
				<Suspense fallback="loading">
					<FantomaOdontogram scale={[10, 10, 10]} position={[0, 0, 0]} teeth={teeth} opacity={gumOpacity ? 1 : 0.8} open={open}/>
				</Suspense>
				{/* <Stats /> */}
			</Canvas>
		</>
	)
}
export default Odontogram



const Icon =()=> {
	return (
	  <svg
		xmlns="http://www.w3.org/2000/svg"
		width="1rem"
		height="1rem"
		x="0"
		y="0"
		version="1.1"
		viewBox="0 0 90 90"
		xmlSpace="preserve"
	  >
		<path 
		fill='white'
		d="M69.772 20.224C63.521 7.917 50.719 0 36.883 0 16.546 0 0 16.546 0 36.883c0 13.836 7.917 26.638 20.224 32.889C26.32 81.761 38.771 90 53.117 90 73.454 90 90 73.454 90 53.117c0-14.347-8.239-26.797-20.228-32.893zm-16.717 1.011l15.71 15.71a31.866 31.866 0 01-.66 6.411L46.644 21.895a31.874 31.874 0 016.411-.66zm-29.28 44.35a31.458 31.458 0 01-1.51-4.43l6.59 6.59a31.559 31.559 0 01-4.871-1.698c-.069-.154-.143-.306-.209-.462zm13.17 3.18l-15.71-15.71c.004-2.196.231-4.34.66-6.412l21.461 21.461c-2.071.43-4.215.657-6.411.661zm11.833-2.309L23.544 41.222a31.773 31.773 0 012.365-4.707l27.577 27.577a31.925 31.925 0 01-4.708 2.364zm8.797-5.345L28.889 32.425a32.082 32.082 0 013.536-3.536l28.686 28.686a32.082 32.082 0 01-3.536 3.536zm6.517-7.626L36.515 25.908a31.816 31.816 0 014.707-2.364l25.234 25.234a31.768 31.768 0 01-2.364 4.707zm-2.937-31.22a31.469 31.469 0 014.892 1.719 31.559 31.559 0 011.698 4.871zM53.117 85c-10.216 0-19.319-4.835-25.158-12.331a36.842 36.842 0 008.924 1.098c20.338 0 36.884-16.546 36.884-36.883 0-3.047-.377-6.028-1.098-8.924C80.165 33.798 85 42.901 85 53.117 85 70.697 70.697 85 53.117 85z"></path>
	  </svg>
	);
}