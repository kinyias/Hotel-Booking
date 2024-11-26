import { formatCurrency } from '../utils/formatCurrency';
interface PriceDisplayProps {
    price: number;
}
const PriceDisplay = ({ price }: PriceDisplayProps) => {
    return <span>{formatCurrency(price)}</span>;
};

export default PriceDisplay;
