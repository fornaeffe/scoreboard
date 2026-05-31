import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { useTranslation } from 'react-i18next'

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

async function scegliFileSalva(dati: any, fileName: string, textFileDescription: string) {
    try {

        fileHandle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{
              description: textFileDescription,
              accept: {'text/plain': ['.txt']},
            }],
          })

        scriviFile(dati)

    } catch(error) {
        console.error(error)
    }    
}

export function ApriDati(props: {aggiornaDati: (dati: any) =>  void}) {
    const { t } = useTranslation()

    return <Button onClick={(e) => scegliFileApri(props.aggiornaDati)} startIcon={<UploadIcon />}>
        {t('actions.load')}
    </Button>
}


export function SalvaDati(props: {dati: any}) {
    const { t } = useTranslation()

    return <Button onClick={(e) => scegliFileSalva(props.dati, t('storage.fileName'), t('storage.textFile'))} startIcon={<DownloadIcon />}>
        {t('actions.save')}
    </Button>
}

export function AutoSaveSwitch(props: { value: boolean, onChange: () => void }) {
    const { t } = useTranslation()

    return <FormControlLabel control={<Switch 
            checked={props.value}
            onChange={(e) => props.onChange()}
        />} label={t('storage.autoSave')} />
    
  };
