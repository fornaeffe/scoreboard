import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { aggiungiSquadra, aumentaPunteggio, cambiaPunteggio, getStato, rimuoviSquadra, setStato, Squadra, useMotore } from './motore';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { ApriDati, SalvaDati } from './storage';


function App() {
  useMotore()
  
  return (
    <div className="App">
      <CssBaseline />
      <div className='contenitore_titolo'>
        <div className='scatola_titolo'><div className='titolo'>Segnapunti</div></div>
        
        <ApriDati aggiornaDati={setStato} />
        <SalvaDati dati={getStato()} />
      </div>

      
      {getStato().elencoSquadre.map((s, i) => <RigaSquadra key={i} i={i} />)}
      <RigaNuovaSquadra />
    </div>
  );
}

function RigaSquadra(props: {
  i: number
}) {

  const [stato, setStato] = useState({attivo: false, modifica: false})

  function setAttivo(val : boolean) {
    setStato({...stato, attivo: val})
  }

  function setModifica(val : boolean) {
    setStato({...stato, modifica: val})
  }

  const s = getStato().elencoSquadre[props.i]

  return <div 
    className='riga_squadra'
    onMouseEnter={(e) => {if (!stato.modifica) setAttivo(true)}}
    onMouseLeave={(e) => {if (!stato.modifica) setAttivo(false)}}
    onClick={(e) => {if (!stato.modifica) setAttivo(!stato.attivo)}}
  >
    <div className='pulsantiera'>
    {
      stato.attivo ?
      <>
        <IconButton onClick={
          (e) => {
            aumentaPunteggio(props.i)
            e.stopPropagation()
          }
        }>+1</IconButton>
        {stato.modifica ? 
          <IconButton onClick={(e) => {setModifica(false); e.stopPropagation()}}><CloseIcon /></IconButton> : 
          <IconButton onClick={(e) => {setModifica(true); e.stopPropagation()}}><EditIcon /></IconButton>
        }
        <IconButton onClick={(e) => rimuoviSquadra(props.i)}><DeleteIcon /></IconButton>
      </> :
      <></>
    }
    </div>

    <div className='barra' style={{ width : s.punteggio + '%', backgroundColor: 'hsl(' + s.colore + ', 100%, 75%)'}}>
    </div>
    
    { stato.modifica ?
      <ModificaPunteggio punteggio={s.punteggio} i={props.i} onChiudi={() => setModifica(false)} />:
      <Avatar sx={{ bgcolor: 'hsl(' + s.colore + ', 100%, 65%)', color: 'black', transition: 'all 1s' }} >{s.punteggio}</Avatar>
    }

    <div className='nome_squadra'>{s.nome}</div>
  </div>
}

function ModificaPunteggio(props: {punteggio: number, i: number, onChiudi: () => void}) {
  const [valore, setValore] = useState(props.punteggio)

  return <>
    <TextField label="Punt." value={valore} onChange={(e) => setValore(parseFloat(e.target.value))} sx={{width: '4em'}} />
    <IconButton aria-label="Conferma" color="primary" onClick={(e) => {
      cambiaPunteggio(props.i, valore)
      props.onChiudi()
      }}><CheckIcon /></IconButton>
  </>
}

// <div className='punteggio' style={{ backgroundColor: 'hsl(' + props.s.colore + ', 100%, 50%)'}}><div>{props.s.punteggio}</div></div>

function RigaNuovaSquadra() {
  const [attivo, setAttivo] = useState(false)
  return <div>
      {attivo ? 
       <InputNuovaSquadra onChiudi={() => setAttivo(false)}/> :
       <Button onClick={(e) => setAttivo(true)} startIcon={<AddIcon />}>Aggiungi squadra</Button>
      }
    </div>
}

function InputNuovaSquadra(props: {onChiudi: () => void}) {
  const [nome, setNome] = useState('')

  return <>
    <TextField id="nome-nuova-squadra" label="Nome squadra" value={nome} onChange={(e) => setNome(e.target.value)} />
    <IconButton aria-label="Conferma" color="primary" onClick={(e) => {
      aggiungiSquadra(nome)
      props.onChiudi()
      }}><CheckIcon /></IconButton>
      <IconButton aria-label="Annulla" color="primary" onClick={(e) => {
      props.onChiudi()
      }}><CloseIcon /></IconButton>
  </>
}


export default App;
