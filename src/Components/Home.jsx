


import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import TradingViewWidget from 'react-tradingview-widget';
import 'react-toastify/dist/ReactToastify.css';

import { Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const ALPHA_VANTAGE_API_KEY = 'CD5APXP15BV41R7L'; 

const topStocks = [
    { name: 'Apple Inc.', symbol: 'AAPL', sector: 'Technology' },
    { name: 'Microsoft Corporation', symbol: 'MSFT', sector: 'Technology' },
    { name: 'Alphabet Inc.', symbol: 'GOOGL', sector: 'Technology' },
    { name: 'Amazon.com Inc.', symbol: 'AMZN', sector: 'Consumer Discretionary' },
    { name: 'Tesla Inc.', symbol: 'TSLA', sector: 'Automotive/Technology' },
    { name: 'Meta Platforms Inc.', symbol: 'META', sector: 'Technology' },
    { name: 'NVIDIA Corporation', symbol: 'NVDA', sector: 'Technology' },
    { name: 'Berkshire Hathaway Inc.', symbol: 'BRK.B', sector: 'Financials' },
    { name: 'Johnson & Johnson', symbol: 'JNJ', sector: 'Healthcare' },
    { name: 'Visa Inc.', symbol: 'V', sector: 'Financials' },
    { name: 'Procter & Gamble Co.', symbol: 'PG', sector: 'Consumer Staples' },
    { name: 'JPMorgan Chase & Co.', symbol: 'JPM', sector: 'Financials' },
    { name: 'UnitedHealth Group Incorporated', symbol: 'UNH', sector: 'Healthcare' },
    { name: 'Walt Disney Company', symbol: 'DIS', sector: 'Consumer Discretionary' },
    { name: 'Mastercard Incorporated', symbol: 'MA', sector: 'Financials' },
    { name: 'Cisco Systems Inc.', symbol: 'CSCO', sector: 'Technology' },
    { name: 'Intel Corporation', symbol: 'INTC', sector: 'Technology' },
    { name: 'Pfizer Inc.', symbol: 'PFE', sector: 'Healthcare' },
    { name: 'Coca-Cola Company', symbol: 'KO', sector: 'Consumer Staples' },
    { name: 'Oracle Corporation', symbol: 'ORCL', sector: 'Technology' }
];

function Home() {
    const [stockData, setStockData] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [newStock, setNewStock] = useState({ name: '', symbol: '', datetime: '' });
    const [portfolio, setPortfolio] = useState([]);
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);

    const fetchStockData = async (symbol, label) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
            console.log('API Response:', response.data);
            const data = response.data['Time Series (Daily)'];
            const result = response.data["Meta Data"];

            const { "1. Information": information, "2. Symbol": symbolName, "3. Last Refreshed": lastRefreshed, "4. Output Size": outputSize, "5. Time Zone": timeZone } = result;
            console.log('Information:', information, 'Symbol:', symbolName, 'Last Refreshed:', lastRefreshed, 'Output Size:', outputSize, 'Time Zone:', timeZone);
            setNewStock({ name: timeZone, symbol: symbol, datetime: new Date().toISOString() });

            if (data) {
                const formattedData = Object.entries(data).map(([date, values]) => ({
                    date,
                    open: values['1. open'],
                    high: values['2. high'],
                    low: values['3. low'],
                    close: values['4. close'],
                    volume: values['5. volume'],
                }));
                setStockData(formattedData);
                setSelectedStock({ value: symbol, label });
                setLoading(false);
            } else {
                setLoading(false);
                toast.error('No data available for this symbol.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching stock data:', error);
            toast.error('Failed to fetch stock data.');
        }
    };

    const handleStockSelect = (selectedOption) => {
        fetchStockData(selectedOption.value, selectedOption.label);
    };

    const handleTopStockClick = (stock) => {
        fetchStockData(stock.symbol, stock.name);
    };

    const loadOptions = useCallback(async (inputValue) => {
        if (!inputValue) {
            return [];
        }

        try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue}&apikey=${ALPHA_VANTAGE_API_KEY}`);
            const matches = response.data.bestMatches || [];
            return matches.map(match => ({
                label: `${match['2. name']} (${match['1. symbol']})`,
                value: match['1. symbol'],
            }));
        } catch (error) {
            console.error('Error fetching stock options:', error);
            toast.error('Failed to fetch stock options.');
            return [];
        }
    }, []);

    return (
        <Container>
         

            <Row className="justify-content-center">
                <Col xs={12} md={12} lg={12}>
                    <div className="bg-light p-4 rounded shadow-sm">
                        <h4 className="text-center mb-3">Search for a Stock</h4>
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadOptions}
                            onChange={handleStockSelect}
                            placeholder="Type to search..."
                            className="stock-select"
                        />
                    </div>
                </Col>
            </Row>

            {loading && <Spinner animation="border" className="mx-auto d-block" />}

            {!selectedStock && stockData.length === 0 && (
                <Row>
                    {topStocks.map((stock, index) => (
                        <Col xs={12} md={6} lg={4} key={index} className=" mt-4 mb-4">
                            <Card className="shadow-sm" onClick={() => handleTopStockClick(stock)} style={{ cursor: 'pointer' }}>
                                <Card.Body>
                                    <Card.Title>{stock.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{stock.symbol}</Card.Subtitle>
                                    <Card.Text>
                                        Sector: {stock.sector}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {selectedStock && stockData.length > 0 && (
                <Card className="my-4 p-3 shadow-lg rounded">
                    <Card.Header className="bg-primary text-white">
                        <h2>{selectedStock.label}</h2>
                    </Card.Header>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col xs={12} md={12} className="mb-3 mb-md-0">
                                <div style={{ width: '80vw', maxWidth: '100%', height: '80vh' }}>
                                    <TradingViewWidget symbol={selectedStock.value} autosize theme="light" />
                                </div>
                            </Col>
                        </Row>
                        <div className="mt-4">
                            <h3>Historical Data</h3>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr className="text-center">
                                            <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Date</th>
                                            <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Open</th>
                                            <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Close</th>
                                            <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>High</th>
                                            <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Low</th>
                                            <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Volume</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockData.map((entry, index) => (
                                            <tr key={index} className="text-center">
                                                <td>{entry.date}</td>
                                                <td>{entry.open}</td>
                                                <td>{entry.close}</td>
                                                <td>{entry.high}</td>
                                                <td>{entry.low}</td>
                                                <td>{entry.volume}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}

            <ToastContainer />
        </Container>
    );
}

export default Home;

