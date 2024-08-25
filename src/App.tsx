import { useEffect, useState } from 'react'

import './style.css'



interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [languageCode: string]: {
        official: string;
        common: string;
      };
    };
  };
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: {
    [currencyCode: string]: {
      name: string;
      symbol: string;
    };
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  capital?: string[];
  altSpellings: string[];
  region: string;
  languages: { [languageCode: string]: string };
  translations: {
    [languageCode: string]: {
      official: string;
      common: string;
    };
  };
  latlng: number[];
  landlocked: boolean;
  area: number;
  demonyms?: {
    eng: {
      f: string;
      m: string;
    };
  };
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  car: {
    signs: string[];
    side: string;
  };
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
  };
  coatOfArms: {};
  startOfWeek: string;
  capitalInfo?: {
    latlng: number[];
  };
}



function App() {

  const [centralData, setCentralData] = useState<Country[]>()
  const [data, setData] = useState<Country[]>([])
  const [page, setPage] = useState(0)
  const [input, setInput] = useState("")
  const [singleData, setSingleData] = useState<Country>()
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const json = await response.json();
        setCentralData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const json = await response.json();
        setData(json.slice(25 * page, 25 * page + 25));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, [page]);

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value)
  }

  function asc() {
    setData([...data].sort((a, b) => a.name.official.localeCompare(b.name.official)))
    setCentralData([...centralData!].sort((a, b) => a.name.official.localeCompare(b.name.official)))
  }

  function desc() {
    setData([...data].sort((a, b) => b.name.official.localeCompare(a.name.official)))
    setCentralData([...centralData!].sort((a, b) => b.name.official.localeCompare(a.name.official)))
  }

  function popUp(cca2: string) {
    const popup = data.filter((item) => item.cca2 === cca2)[0]
    setSingleData(popup)
  }

  return (
    <>
      <section id="sidebar">
        <a href="#" className="brand">
          <i className='bx bxs-smile'></i>
          <span className="text">AdminPanel</span>
        </a>
        <ul className="side-menu top">
          <li className="active">
            <a href="#">
              <i className='bx bxs-dashboard' ></i>
              <span className="text">Catalog</span>
            </a>
          </li>
        </ul>
      </section>

      <section id="content">
        <nav>
          <i className='bx bx-menu' ></i>
          <a href="#" className="nav-link">catalog</a>
          <form action="#">
            <div className="form-input">
              <input type="search" placeholder="Search..." value={input} onChange={handleInput} />
              <button type="submit" className="search-btn"><i className='bx bx-search' ></i></button>
            </div>
          </form>
          <input type="checkbox" id="switch-mode" hidden />
          <label htmlFor="switch-mode" className="switch-mode"></label>

          <a href="#" className="profile">
            <img src="img/people.png" />
          </a>
        </nav>

        <main>
          <div className="table-data">
            <div className="order">
              <div className="head">
                <h3>Country Catalog</h3>
                <button className='primary-button' onClick={asc}>asc sort</button>
                <button className='primary-button' onClick={desc}>desc sort</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Flag</th>
                    <th scope="col">Country Name</th>
                    <th scope="col">2 character Country Code</th>
                    <th scope="col">3 character Country Code</th>
                    <th scope="col">Native Country Name</th>
                    <th scope="col">Alternative Country Name</th>
                    <th scope="col">Country Calling Codes</th>
                  </tr>
                </thead>
                {
                  input != "" ?
                    <tbody>
                      {
                        centralData?.filter((item) => item.name.official.toLowerCase().includes(input.toLowerCase())).slice(0, 10).map((t, index) => {
                          return <tr key={index} onClick={() => popUp(t.cca2)}>
                            <td>
                              <img src={t.flags.png} />
                            </td>
                            <td>{t.name.official}</td>
                            <td>{t.cca2}</td>
                            <td>{t.cca3}</td>
                            <td>{t.name?.nativeName ? Object.values(t.name.nativeName).map((p) => p.common).join(', ') : "No Native Name"}</td>
                            <td>{t.altSpellings}</td>
                            <td>{t.idd.root}</td>
                          </tr>
                        })
                      }
                    </tbody>
                    : <tbody>
                      {
                        data.map((t, index) => {
                          return <tr key={index} onClick={() => popUp(t.cca2)}>
                            <td>
                              <img src={t.flags.png} />
                            </td>
                            <td>{t.name.official}</td>
                            <td>{t.cca2}</td>
                            <td>{t.cca3}</td>
                            <td>{t.name?.nativeName ? Object.values(t.name.nativeName).map((p) => p.common).join(', ') : "No Native Name"}</td>
                            <td>{t.altSpellings}</td>
                            <td>{t.idd.root}</td>
                          </tr>
                        })
                      }
                    </tbody>
                }
              </table>
              {!input && <div className='pagination'>
                <button id="prevBtn" onClick={() => { if (page > 0) setPage(page - 1) }} className='pagination-button'>Previous</button>
                <button onClick={() => setPage(page + 1)} className='pagination-button'>1</button>
                <button onClick={() => setPage(page + 1)} className='pagination-button'>2</button>
                <button onClick={() => setPage(page + 1)}  className='pagination-button'>3</button>
                <button id="nextBtn" onClick={() => setPage(page + 1)} className='pagination-button'>Next</button>
              </div>}
            </div>
            
          </div>
        </main>

      </section>
      {
        singleData && <div className='pop' >
          <i onClick={() => setSingleData(undefined)} style={{ position: 'absolute', top: 6, right: 6}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </i>
          <div className="box-image">
          <img src={singleData.flags.png} />
          </div>
          <br></br>
          <th>Country name: {singleData.name.official}</th>
          <br></br>
          <th>Country code 2 character: {singleData.cca2}</th>
          <br></br>
          <th>Country code with 3 character:{singleData.cca3} </th>
          <br></br>
          <th>Native Country Name:{singleData.name?.nativeName ? Object.values(singleData.name.nativeName).map((p) => p.common).join(', ') : "No Native Name"} </th>
          <br></br>
          <th>Alternative Country Name: {singleData.altSpellings}</th>
          <br></br>
          <th>Country Calling Codes:{singleData.idd.root}</th>
      
        </div>
      }
    </>

  )
}

export default App
