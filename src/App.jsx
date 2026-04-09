import { useState, useMemo } from 'react'
import './App.css'

const LB_TO_KG = 0.453592

function App() {
  const [productPrice, setProductPrice] = useState('')
  const [packageWeight, setPackageWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [dollarRate, setDollarRate] = useState('')

  const calculations = useMemo(() => {
    const price = parseFloat(productPrice) || 0
    const weight = parseFloat(packageWeight) || 0
    const rate = parseFloat(dollarRate) || 0

    const weightKg = weightUnit === 'lb' ? weight * LB_TO_KG : weight
    const freightCost = weightKg * 15
    const commission = price * 0.15

    let customsTax = 0
    let taxStatus = 'exempt'
    let taxDetail = 'Producto bajo $41 USD'

    if (price >= 41) {
      const cifValue = price + freightCost
      const arancel = cifValue * 0.06
      const ivaBase = cifValue + arancel
      const iva = ivaBase * 0.19
      customsTax = arancel + iva
      taxStatus = 'applied'
      taxDetail = '6% arancel + 19% IVA sobre valor CIF'
    }

    const totalUSD = price + customsTax + freightCost + commission
    const totalCLP = totalUSD * rate

    return {
      price,
      customsTax,
      freightCost,
      commission,
      totalUSD,
      totalCLP,
      taxStatus,
      taxDetail,
    }
  }, [productPrice, packageWeight, weightUnit, dollarRate])

  const formatUSD = (amount) => `$${amount.toFixed(2)} USD`
  const formatCLP = (amount) => `$${Math.round(amount).toLocaleString('es-CL')} CLP`

  return (
    <div className="container">
      <div className="header">
        <span className="header-icon">🛍️</span>
        <h1>Simulador de Cotizaciones</h1>
        <p className="subtitle">Personal Shopper USA → Chile</p>
      </div>

      <div className="input-section">
        <div className="section-title">
          <span>📋</span>
          <span>Datos de tu Producto</span>
        </div>

        <div className="input-group">
          <label>Precio del Producto</label>
          <div className="input-wrapper">
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
            <span className="currency-symbol">USD</span>
          </div>
        </div>

        <div className="input-group">
          <label>Peso del Paquete</label>
          <div className="input-wrapper">
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={packageWeight}
              onChange={(e) => setPackageWeight(e.target.value)}
            />
            <span className="unit-symbol">{weightUnit}</span>
          </div>
          <div className="unit-toggle">
            <button
              className={weightUnit === 'kg' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setWeightUnit('kg')}
            >
              Kilogramos
            </button>
            <button
              className={weightUnit === 'lb' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setWeightUnit('lb')}
            >
              Libras
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Valor del Dólar Hoy</label>
          <div className="input-wrapper">
            <input
              type="number"
              placeholder="0"
              min="0"
              step="1"
              value={dollarRate}
              onChange={(e) => setDollarRate(e.target.value)}
            />
            <span className="currency-symbol">CLP</span>
          </div>
        </div>
      </div>

      <div className="results-section">
        <div className="section-title">
          <span>💰</span>
          <span>Desglose de Costos</span>
        </div>

        <table className="results-table">
          <tbody>
            <tr>
              <td>Precio del Producto</td>
              <td>{formatUSD(calculations.price)}</td>
            </tr>
            <tr>
              <td>
                Impuestos Aduana
                <span className={calculations.taxStatus === 'exempt' ? 'exempt-badge' : 'tax-applied-badge'}>
                  {calculations.taxStatus === 'exempt' ? 'Exento' : 'Aplicado'}
                </span>
                <span className="tax-detail">{calculations.taxDetail}</span>
              </td>
              <td>{formatUSD(calculations.customsTax)}</td>
            </tr>
            <tr>
              <td>
                Flete Internacional
                <span className="tax-detail">($15 USD/kg)</span>
              </td>
              <td>{formatUSD(calculations.freightCost)}</td>
            </tr>
            <tr>
              <td>
                Comisión Personal Shopper
                <span className="tax-detail">(15%)</span>
              </td>
              <td>{formatUSD(calculations.commission)}</td>
            </tr>
            <tr className="total-row">
              <td>Total en Dólares</td>
              <td>{formatUSD(calculations.totalUSD)}</td>
            </tr>
            <tr className="grand-total">
              <td>Total en Pesos Chilenos</td>
              <td>{formatCLP(calculations.totalCLP)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="note">
        <p>
          <strong>Nota:</strong> Los productos con valor inferior a $41 USD están exentos de impuestos
          aduaneros. Para productos de mayor valor, se aplica un arancel del 6% + IVA del 19% sobre
          el valor CIF (producto + flete).
        </p>
      </div>
    </div>
  )
}

export default App
