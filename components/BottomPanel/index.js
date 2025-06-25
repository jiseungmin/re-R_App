import SlideUpPrescriptionPanel from './SlideUpPrescriptionPanel';
import FixedMeasurePanel from './FixedMeasurePanel';
import FixedConsultPanel from './FixedConsultPanel';

export default function BottomPanel({ type, ...props }) {
  if (type === 'slide') return <SlideUpPrescriptionPanel {...props} />;
  if (type === 'measure') return <FixedMeasurePanel {...props} />;
  if (type === 'consult') return <FixedConsultPanel {...props} />;
  return null;
}
