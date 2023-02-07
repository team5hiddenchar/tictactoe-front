import { useEffect, useState } from "react";
import { BaseResponse } from '../interfaces';

export function Form() {
    const [status, setStatus] = useState<'INITIAL' | 'SEND_DATA' | 'SENDING_DATA' | 'DATA_SENDED' | 'ERROR_SENDING_DATA'>();
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<number| any>();
    const [bdate, setBdate] = useState<string>();
    const [socialStatus, setSocialStatus] = useState<string>();
    const [data , setData] = useState<BaseResponse>();
    const [validate, setValidate]= useState<boolean>();


    useEffect(() => {
        if (status === 'SEND_DATA') {
            setStatus('SENDING_DATA');
            fetch('http://localhost:3001/info/validateForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    age: age,
                    bdate: bdate,
                    socialStatus: socialStatus,
                    validate :validate
                })
                
            })
                .then((rawResponse) => {
                    if ([200, 201].includes(rawResponse.status)) {
                        return rawResponse.json();
                    } else {
                        throw new Error();
                    }
                })
                .then((response: BaseResponse) => {
                    setStatus('DATA_SENDED');
                    setData(response);
                })
                .catch(e => {
                    setStatus('ERROR_SENDING_DATA');
                })
        }
    }, [status, name, age, bdate, socialStatus, validate]);



    if (status === 'ERROR_SENDING_DATA') {
        return (
            <div>
                <h1>ERRORE INVIO DATI </h1>
                <button onClick={() => setStatus('INITIAL')}>RIPROVA</button>
            </div>
        );
    }

    if (status === 'SEND_DATA' || status === 'SENDING_DATA') {
        return (
            <div>
                <h1>INVIO IN CORSO</h1>
                <button onClick={() => setStatus('INITIAL')}>ANNULLA</button>
            </div>
        );
    }

    if (status === 'DATA_SENDED') {
        return (<div className="left-animation ">
            {data?.success === true && <h1>DATI INVIATI VALIDI</h1>}
            {data?.success === false && <h1>DATI INVIATI NON VALIDI</h1>}
            {name.length <= 5  && <p> Il nome deve contenere minimo 5 caratteri  </p>}
            {(calculateAge(bdate)!==age) && <p> La data di nascita non combacia con l'età </p>}
            <button onClick={() => setStatus('INITIAL')}>RIPROVA</button>
        </div>)
    }



    function calculateAge(bdate: any): number {
        const bdateAsDate = new Date(bdate);
        const diff = Date.now() - bdateAsDate.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      }
      
console.log(name.length > 5)

    return (
        <div className="form left-animation">
            <div >
                <h1>Form</h1>
            </div>
            <p>Informazioni:</p>
            <div className="margin-B10px form-box">
                <label >Nome:</label>
                <input id="name" type="text" name="name" value={name} onChange={(e) => {setName(e.target.value);} } />
            </div >
            <div className="margin-B10px form-box">
                <label >Età:</label>
                <input id="age" type="number" name="age" value={age} onChange={(e) => {setAge(Number(e.target.value));}}  />
            </div>
            <div className="margin-B10px form-box">
                <label >Data di nascita</label>
                <input id="bdate" type="date" name="bdate" value={bdate?.toString()} onChange={(e) => {setBdate(e.target.value);}}  />
            </div>
            {(age >= 18)  && <div  className="margin-B10px form-box flex-column">
                <label className="margin-B10px">Stato sociale:</label>
                <div >
                    <div className="flex-radiobutton">
                        <input type="radio" id="radio_1" name="Status"  onChange={(e) => {setSocialStatus("Sposato");}} />
                        <label><span>Sposato/a</span></label>
                    </div>
                    <div  className="flex-radiobutton">
                        <input type="radio"  id="radio_2" name="Status"  onChange={(e) => {setSocialStatus("Celibe");}} />
                        <label><span>Celibe</span></label>
                    </div>
                    <div className="flex-radiobutton">
                        <input type="radio"  id="radio_2" name="Status"  onChange={(e) => {setSocialStatus("nubile");}} />
                        <label><span>Nubile</span></label>
                    </div>
                </div>
            </div>}
            <button onClick={() => (setStatus('SEND_DATA') , setValidate(calculateAge(bdate)===age))}>INVIA</button>
        </div>

    )
}