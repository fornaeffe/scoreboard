import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { aggiungiSquadra, aumentaPunteggio, cambiaPunteggio, getStato, rimuoviSquadra, setStato, Squadra, useMotore, valoreMassimoBarre } from './motore';
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
      { stato.attivo ?
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

    <div className='contenitore_barra'>

      <div className='barra' style={{ width : s.punteggio / valoreMassimoBarre() * 100 + '%', backgroundColor: 'hsl(' + s.colore + ', 100%, 75%)'}}></div>

      { stato.modifica ?
        <ModificaPunteggio punteggio={s.punteggio} i={props.i} onChiudi={() => setModifica(false)} /> :
        <Avatar sx={{ bgcolor: 'hsl(' + s.colore + ', 100%, 65%)', color: 'black', transition: 'all 1s' }} >{s.punteggio}</Avatar>
      }

      <div className='nome_squadra'>{s.nome}</div>

    </div>

  </div>
}

function ModificaPunteggio(props: {punteggio: number, i: number, onChiudi: () => void}) {
  const [valore, setValore] = useState(props.punteggio.toString())

  function conferma() {
    const valoreNumerico = Number(valore)

    if (isNaN(valoreNumerico))
      return

    cambiaPunteggio(props.i, parseFloat(valore))
    props.onChiudi()
  }

  return <>
    <TextField 
    label="Punt." 
    sx={{width: '4em'}} 
    value={valore}
    error={isNaN(Number(valore))}
    onChange={(e) => setValore(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && conferma()}
    />
    <IconButton 
    aria-label="Conferma" 
    color="primary" 
    onClick={(e) => conferma()}
    >
      <CheckIcon />
    </IconButton>
  </>
}

function RigaNuovaSquadra() {
  const [attivo, setAttivo] = useState(false)
  return <div className='riga_nuova_squadra'>
      {attivo ? 
       <InputNuovaSquadra onChiudi={() => setAttivo(false)}/> :
       <Button onClick={(e) => setAttivo(true)} startIcon={<AddIcon />}>Aggiungi squadra</Button>
      }
    </div>
}

function InputNuovaSquadra(props: {onChiudi: () => void}) {
  const [nome, setNome] = useState('')

  function conferma() {
    aggiungiSquadra(nome)
    props.onChiudi()
  }

  return <>
    <TextField 
    id="nome-nuova-squadra" 
    label="Nome squadra"
    margin="normal"
    autoFocus
    value={nome} 
    onChange={(e) => setNome(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && conferma()}
    />
    <IconButton 
    aria-label="Conferma" 
    color="primary" 
    onClick={(e) => conferma()}
    >
      <CheckIcon />
    </IconButton>
    <IconButton 
    aria-label="Annulla" 
    color="primary" 
    onClick={(e) => props.onChiudi()}
    >
      <CloseIcon />
    </IconButton>
  </>
}


export default App;
