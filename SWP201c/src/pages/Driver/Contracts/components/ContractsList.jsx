// Driver/Contracts/components/ContractsList.jsx
// Grid of contract cards

import PropTypes from 'prop-types';
import ContractCard from './ContractCard';

const ContractsList = ({ contracts, onContractClick }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem'
    }}>
      {contracts.map(contract => (
        <ContractCard
          key={contract.id}
          contract={contract}
          onClick={onContractClick}
        />
      ))}
    </div>
  );
};

ContractsList.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onContractClick: PropTypes.func.isRequired
};

export default ContractsList;
