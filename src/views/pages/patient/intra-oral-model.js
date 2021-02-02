import React, { useState } from 'react'
import Unity, { UnityContext } from 'react-unity-webgl'
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import '../../../assets/css/app.css'

const unityContext = new UnityContext({
    loaderUrl: '/Build/Build/Build.loader.js',
    dataUrl: '/Build/Build/Build.data',
    frameworkUrl: '/Build/Build/Build.framework.js',
    codeUrl: '/Build/Build/Build.wasm'
})

const IntraOralModel = (props) => {
  const [emptyTeeths, setEmptyTeeths] = useState('')
  const [halfTeeths, setHalfTeeths] = useState('')

  const prepareTeeths = () => {
    var empty = emptyTeeths.split(',')
    var half = halfTeeths.split(',')

    var json = "["
    if (emptyTeeths != '') {
      empty.forEach(teeth => {
        json += "{\"teeth_id\": " + teeth + ", \"state_id\":0}, "
      })
    }
    if (halfTeeths != '') {
      half.forEach(teeth => {
        json += "{\"teeth_id\": " + teeth + ", \"state_id\":1}, "
      })
    }
    json = json.slice(0, -2)
    json += "]"

    unityContext.send(
      "Handlers",
      "UpdateTeeths",
      json
    )
  }

	return (
		<Container>
			<Row>
				<Col xs="6" sm="6" md="6" lg="6">
					<Form>
            <FormGroup>
							<Label>Dientes quebrados</Label>
							<Input type="text" placeholder="Ej: 1.8, 1.4, 1.1, 2.2" 
								onChange={(e) => setHalfTeeths(e.target.value)}
							/>
						</FormGroup>
						<FormGroup>
							<Label>Dientes faltantes</Label>
							<Input type="text" placeholder="Ej: 1.8, 1.4, 1.1, 2.2" 
								onChange={(e) => setEmptyTeeths(e.target.value)}
							/>
						</FormGroup>
						<Button color="primary" type="button"
							onClick={prepareTeeths}
						>
							Generar
						</Button>
					</Form>
				</Col>
				<Col xs="6" sm="6" md="6" lg="6">
					<div>
						<Unity unityContext={unityContext} width='100%' height="80vh"/>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default IntraOralModel