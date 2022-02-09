import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [hotalData, setHotalData] = useState([]);
  const [hotalDataInitial, setHotalDataInitial] = useState([]);
  const [selectedPage, setSelectedPage] = useState(0);
  const [sortBy, setSortBy] = useState({});
  const [filter, setFilter] = useState({
    "Hotel": '',
    "Rate": '',
    "PriceFrom": '',
    "PriceTo": '',
    "RoomAmenities": ''
  });
  function changeFilter(filtername, value) {
    setFilter({
      ...filter,
      [filtername]: value
    })
  }
  useEffect(() => {
    fetch('http://127.0.0.1:5000/')
      .then(response => response.json())
      .then(data => setHotalDataInitial(data));
  }, [])

  useEffect(() => {
    setHotalData(
      hotalDataInitial.filter((record) => (
        (+record.Rate === +filter.Rate || filter.Rate === '') &&
        (+record.Price >= +filter.PriceFrom || filter.PriceFrom === '') &&
        (+record.Price <= +filter.PriceTo || filter.PriceTo === '') &&
        (record.Hotel.toLowerCase().includes(filter.Hotel.toLowerCase()) || filter.Hotel === '') &&
        (record.RoomAmenities.toLowerCase().includes(filter.RoomAmenities.toLowerCase()) || filter.RoomAmenities === '')
      ))
    )
    setSelectedPage(0);
    setSortBy('');
  }, [filter, hotalDataInitial]);

  useEffect(() => {
    setHotalData([...hotalData.sort(
      function (a, b) {
        if (a[sortBy.key] > b[sortBy.key]) {
          return sortBy.orderAsc ? 1 : -1;
        }
        if (a[sortBy.key] < b[sortBy.key]) {
          return sortBy.orderAsc ? -1 : 1;
        }
        return 0;
      })]);
  }, [sortBy]);

  useEffect(()=>{
    console.log(hotalData);
  },[hotalData])
  function renderPagination(pagesNumber) {
    let paginations = [];
    for (let index = 0; index < pagesNumber; index += 1) {
      paginations.push(
        <div key={`pagesNumber-${index}`} onClick={() => { setSelectedPage(index) }} className={selectedPage === index ? 'active' : ''}> {index + 1}</div >
      )
    }
    return paginations;
  }

  function renderData(Data) {
    let dataValues = [];
    for (let index = selectedPage * 5; index < Data.length && index < (selectedPage + 1) * 5; index += 1) {
      dataValues.push(
        <tr key={`hotalRecord-${index}`}>
          <td>{Data[index].Hotel}</td>
          <td>{Data[index].Rate}</td>
          <td>{Data[index].Price}</td>
          <td>{Data[index].RoomAmenities}</td>
        </tr>);
    }
    return dataValues;
  }
  function handleSortOnClick(key) {
    setSortBy({ key, orderAsc: !(sortBy.key === key && sortBy.orderAsc) })
  }
  return (
    <div className="App">
      <table id="customers">
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Rate <div role='button' className="fa icons" onClick={() => { handleSortOnClick('Rate') }}>{!(sortBy.key === 'Rate' && sortBy.orderAsc) ? <>&#xf063;</> : <>&#xf062;</>}</div></th>
            <th>Price <div role='button' className="fa icons" onClick={() => { handleSortOnClick('Price') }}>{!(sortBy.key === 'Price' && sortBy.orderAsc) ? <>&#xf063;</> : <>&#xf062;</>}</div></th>
            <th>RoomAmenities</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type='text' onChange={(event) => { changeFilter('Hotel', event.target.value) }}></input></td>
            <td><input type='number' onChange={(event) => { changeFilter('Rate', event.target.value) }}></input></td>
            <td>from <input className='input-price' type='number' onChange={(event) => { changeFilter('PriceFrom', event.target.value) }}></input> to <input className='input-price' type='number' onChange={(event) => { changeFilter('PriceTo', event.target.value) }}></input></td>
            <td><input type='text' onChange={(event) => { changeFilter('RoomAmenities', event.target.value) }}></input></td >
          </tr >
          {renderData(hotalData)}
        </tbody>
      </table >
      <div className="paginationWrapper">
        <div className="pagination">
          {renderPagination(Math.ceil(hotalData.length / 5))}
        </div>
      </div>
    </div >
  );
}

export default App;
