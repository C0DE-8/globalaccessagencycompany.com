import ServiceDetail from '../service-detail/ServiceDetail'
import { services } from '../../data/services'

export default function Page(props) {
  const service = services.find((item) => item.slug === 'warehousing')
  return <ServiceDetail service={service} {...props} />
}
