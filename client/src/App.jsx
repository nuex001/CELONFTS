import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEthersSigner } from "../src/utils/ethers";
import { contractAddress, ABI } from "../src/utils/contants";
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';

function App() {
  const [cohort, setCohort] = useState();
  const [formdata, setFormdata] = useState({
    cohortno: 0,
    imgUrl: "",
  });
  const signer = useEthersSigner();
  const { data: walletClient } = useWalletClient();
  const { cohortno, imgUrl } = formdata;

  function handleFileSelect(evt) {
    if (cohortno > 0 && imgUrl !== "") {
      const files = evt.target.files;
      const file = files[0];
      const reader = new FileReader();

      reader.onload = function (evt) {
        var csv = evt.target.result;
        var lines = csv.split(/\r\n|\n/);
        let columnArray = [];

        for (var i = 0; i < lines.length; i++) {
          const lineArray = lines[i].split(',');

          // Check for spaces in the first and second columns (address and anotherColumn) and exclude empty lines
          if (!lineArray[0].includes("Name") && lineArray[0].trim() !== "" &&
            !lineArray[1].includes("addr") && lineArray[1].trim() !== "") {
            const name = lineArray[0].replace(/\s/g, ""); // Remove spaces from the first column
            const student = lineArray[1].trim(); // Trim any extra spaces from the second column
            // You can process or store these values as needed
            columnArray.push({ student: student, name: name, image: imgUrl, classOf: cohortno, added: false });
          }
        }
        // Assuming setCsv is defined elsewhere in your code
        console.log('====================================');
        console.log(columnArray);
        console.log('====================================');
        setCohort(columnArray);
        // console.log(columnArray);
      };

      // This line should be inside the handleFileSelect function
      reader.readAsText(file);
    } else {
      window.alert("please input all field before the adding file");
    }
  }

  const updateFile = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  }

  const addcohort = async (e) => {
    e.preventDefault();
    if (cohortno > 0 && imgUrl !== "") {
      if (walletClient) {
        const contract = new ethers.Contract(
          contractAddress,
          ABI,
          signer
        );
        console.log(cohort);
        const tx = await contract.addClass(cohort);
        //Reset form
        e.target.reset();
        setFormdata({
          cohortno: 0,
          imgUrl: "",
        });
      }
    } else {
      window.alert("please input all field before the adding cohort");
    }
  }
  const mintNft = async (e) => {
    if (walletClient) {
      const contract = new ethers.Contract(
        contractAddress,
        ABI,
        signer
      );
      const accounts = await walletClient.getAddresses();
      const tx = await contract.mint({ from: accounts[0] });
      // const tx = await contract.changeOwner("0x0c0281d418D5d0C4838D86B99a73BE5B2d95eD54");
      // const tx = await contract.tokenURI(0);
      // console.log(tx);
    }
  }

  return (
    <div className='container'>
      <form action="" onSubmit={addcohort}>
        <div className="box">
          <label htmlFor="cohort"> File </label>
          <input type="file" name="cohort" id="cohort" onChange={handleFileSelect} />
        </div>
        <div className="box">
          <label htmlFor="cohortno"> Cohort</label>
          <input type="number" name="cohortno" id="cohortno" value={cohortno} onChange={updateFile} />
        </div>
        <div className="box">
          <label htmlFor="imgUrl"> Img Url</label>
          <input type="text" name="imgUrl" id="imgUrl" placeholder='https://img.com' value={imgUrl} onChange={updateFile} />
        </div>
        <div className="box">
          <button>ADD COHORT</button>
        </div>
      </form>
      <div className="row">
        <ConnectButton /> <button className='mint' onClick={mintNft}>MINT</button>
      </div>
    </div>
  )
}

export default App
