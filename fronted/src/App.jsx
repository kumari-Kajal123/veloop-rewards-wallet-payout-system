import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from './Pages/Auth';
import Home from './Pages/Home';
import Transactions from "./Pages/Transactions";
import Withdraw from "./Pages/Withdraw";
import Withdrawals from "./Pages/Withdrawals";
import AdminWithdrawals from "./Pages/AdminWithdrawals";

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Auth></Auth>} />
        <Route path='/home' element={<Home></Home>} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/withdraw" element={<Withdraw />}/>
        <Route path="/withdrawals" element={<Withdrawals />} />
        <Route path="/admin/withdrawals" element={<AdminWithdrawals />}/>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
