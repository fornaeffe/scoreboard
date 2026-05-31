import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { aggiungiSquadra, aumentaPunteggio, cambiaPunteggio, getStato, rimuoviSquadra, setStato, useMotore, valoreMassimoBarre } from './motore';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { ApriDati, SalvaDati } from './storage';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from './i18n';

const githubRepoUrl = 'https://github.com/fornaeffe/scoreboard';
const licenseUrl = `${githubRepoUrl}/blob/main/LICENSE`;

function App() {
  useMotore()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const language = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]
    document.documentElement.lang = language
    document.title = t('app.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('app.description'))
  }, [i18n.language, i18n.resolvedLanguage, t])
  
  return (
    <div className="App">
      <CssBaseline />
      <div className='contenitore_titolo'>
        <div className='scatola_titolo'><div className='titolo'>{t('app.title')}</div></div>
        
        <div className='azioni_titolo'>
          <ApriDati aggiornaDati={setStato} />
          <SalvaDati dati={getStato()} />
          <div className='meta_titolo'>
            <LanguageSelector />
            <a className='link_meta' href={githubRepoUrl} aria-label={t('links.githubAria')} title={t('links.githubAria')}>
              {t('links.github')}
            </a>
            <span className='separatore_meta' aria-hidden='true'>·</span>
            <a className='link_meta' href={licenseUrl} aria-label={t('links.licenseAria')} title={t('links.licenseAria')}>
              {t('links.license')}
            </a>
          </div>
        </div>
      </div>

      
      {getStato().elencoSquadre.map((s, i) => <RigaSquadra key={i} i={i} />)}
      <RigaNuovaSquadra />
    </div>
  );
}

function LanguageSelector() {
  const { t, i18n } = useTranslation()
  const language = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]
  const currentLanguage = supportedLanguages.some(supportedLanguage => supportedLanguage.code === language) ? language : 'en'

  return <select
    className='selettore_lingua'
    aria-label={t('language.selectorLabel')}
    title={t('language.selectorLabel')}
    value={currentLanguage}
    onChange={(e) => i18n.changeLanguage(e.target.value)}
  >
    {supportedLanguages.map(language => <option key={language.code} value={language.code}>{language.label}</option>)}
  </select>
}

function RigaSquadra(props: {
  i: number
}) {
  const { t } = useTranslation()

  const [stato, setStato] = useState({attivo: false, modifica: false})

  function setAttivo(val : boolean) {
    setStato({...stato, attivo: val})
  }

  function setModifica(val : boolean) {
    setStato({...stato, modifica: val})
  }

  const s = getStato().elencoSquadre[props.i]
  const incrementScoreLabel = t('actions.incrementScore', {team: s.nome})
  const editScoreLabel = t('actions.editScore', {team: s.nome})
  const closeScoreEditorLabel = t('actions.closeScoreEditor')
  const deleteTeamLabel = t('actions.deleteTeam', {team: s.nome})

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
          } aria-label={incrementScoreLabel} title={incrementScoreLabel}>+1</IconButton>
          {stato.modifica ? 
            <IconButton aria-label={closeScoreEditorLabel} title={closeScoreEditorLabel} onClick={(e) => {setModifica(false); e.stopPropagation()}}><CloseIcon /></IconButton> : 
            <IconButton aria-label={editScoreLabel} title={editScoreLabel} onClick={(e) => {setModifica(true); e.stopPropagation()}}><EditIcon /></IconButton>
          }
          <IconButton aria-label={deleteTeamLabel} title={deleteTeamLabel} onClick={(e) => {rimuoviSquadra(props.i); e.stopPropagation()}}><DeleteIcon /></IconButton>
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
  const { t } = useTranslation()
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
    label={t('fields.scoreShort')} 
    sx={{width: '4em'}} 
    value={valore}
    error={isNaN(Number(valore))}
    onChange={(e) => setValore(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && conferma()}
    />
    <IconButton 
    aria-label={t('actions.confirm')} 
    title={t('actions.confirm')}
    color="primary" 
    onClick={(e) => conferma()}
    >
      <CheckIcon />
    </IconButton>
  </>
}

function RigaNuovaSquadra() {
  const { t } = useTranslation()
  const [attivo, setAttivo] = useState(false)
  return <div className='riga_nuova_squadra'>
      {attivo ? 
       <InputNuovaSquadra onChiudi={() => setAttivo(false)}/> :
       <Button onClick={(e) => setAttivo(true)} startIcon={<AddIcon />}>{t('actions.addTeam')}</Button>
      }
    </div>
}

function InputNuovaSquadra(props: {onChiudi: () => void}) {
  const { t } = useTranslation()
  const [nome, setNome] = useState('')

  function conferma() {
    aggiungiSquadra(nome)
    props.onChiudi()
  }

  return <>
    <TextField 
    id="nome-nuova-squadra" 
    label={t('fields.teamName')}
    margin="normal"
    autoFocus
    value={nome} 
    onChange={(e) => setNome(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && conferma()}
    />
    <IconButton 
    aria-label={t('actions.confirm')} 
    title={t('actions.confirm')}
    color="primary" 
    onClick={(e) => conferma()}
    >
      <CheckIcon />
    </IconButton>
    <IconButton 
    aria-label={t('actions.cancel')} 
    title={t('actions.cancel')}
    color="primary" 
    onClick={(e) => props.onChiudi()}
    >
      <CloseIcon />
    </IconButton>
  </>
}


export default App;
