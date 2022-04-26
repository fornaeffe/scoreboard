import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'

let fileHandle : FileSystemFileHandle

export async function scriviFile(dati: any) {
    try {
        const writableStream = await fileHandle.createWritable()

        const blob = new Blob([JSON.stringify(dati, null, 2)], {type : 'application/json'});

        await writableStream.write(blob);

        await writableStream.close();
    } catch(error) {
        console.error(error)
    }
}

async function scegliFileApri(aggiornaDati: (dati: any) =>  void) {
    try {
        [fileHandle] = await window.showOpenFilePicker()
        const file = await fileHandle.getFile()
        const contenuto = await file.text()
        const datiLetti = JSON.parse(contenuto)
        aggiornaDati(datiLetti)
    } catch(error) {
        console.error(error)
    }
}

async function scegliFileSalva(dati: any) {
    try {

        fileHandle = await window.showSaveFilePicker({
            suggestedName: 'dati.txt',
            types: [{
              description: 'Text file',
              accept: {'text/plain': ['.txt']},
            }],
          })

        scriviFile(dati)

    } catch(error) {
        console.error(error)
    }    
}

export function ApriDati(props: {aggiornaDati: (dati: any) =>  void}) {
    return <Button onClick={(e) => scegliFileApri(props.aggiornaDati)} startIcon={<UploadIcon />}>
        Carica
    </Button>
}


export function SalvaDati(props: {dati: any}) {
    return <Button onClick={(e) => scegliFileSalva(props.dati)} startIcon={<DownloadIcon />}>
        Salva
    </Button>
}

export function AutoSaveSwitch(props: { value: boolean, onChange: () => void }) {
    return <FormControlLabel control={<Switch 
            checked={props.value}
            onChange={(e) => props.onChange()}
        />} label="AutoSave" />
    
  };