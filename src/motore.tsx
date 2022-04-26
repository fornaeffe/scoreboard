import { useEffect, useState } from "react"

const evento = new Event('cambioStato')

export function useMotore() {
	const [, refresh] = useState({})
	useEffect(() => osservaStato(() => refresh({})))
}

export function osservaStato(x: () => void) {
	const listener: EventListener = e => x()
	document.body.addEventListener(evento.type, listener)
	return () => document.body.removeEventListener(evento.type, listener)
}

export function setStato(s: Stato) {
	stato = s
	document.body.dispatchEvent(evento)
}

export function aggiungiSquadra(nome: string) {
  stato.elencoSquadre.push({nome: nome, punteggio: 0, colore: Math.floor(Math.random() * 360)})
	document.body.dispatchEvent(evento)
}


export function rimuoviSquadra(id: number) {
  stato.elencoSquadre.splice(id, 1)
	document.body.dispatchEvent(evento)
}

export function aumentaPunteggio(id: number) {
  stato.elencoSquadre[id].punteggio ++
	document.body.dispatchEvent(evento)
}

export function cambiaPunteggio(id: number, punteggio: number) {
  stato.elencoSquadre[id].punteggio = punteggio  
	document.body.dispatchEvent(evento)
}

export type Squadra = {
  nome: string
  punteggio: number
  colore: number
}

type Stato = {
  elencoSquadre: Squadra[]
}
  

const stato_iniziale : Stato = {
  elencoSquadre: []
}

let stato = stato_iniziale

export function getStato() {
	return stato
}
