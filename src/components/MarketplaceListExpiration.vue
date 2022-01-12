<template>
  <span :class="`text-${expiration.color}`">{{ expiration.text }}</span>
</template>
<script lang="ts">
import { ColoredMessage } from '@/models/ColoredMessage'
import { TableViewTrip } from '@/models/dto'
import { timeDifferenceAsObject, timeObjectToString } from '@/utils/time'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class MarketplaceListExpiration extends Vue {
  @Prop({ required: true }) readonly row: TableViewTrip

  get expiration(): ColoredMessage {
    const now = (this as any).$dayjs.utc()
    const expiration = (this as any).$dayjs(this.row.biddingEndDate)
    const diffObj = timeDifferenceAsObject(now, expiration)
    const isExpired = !!Object.values(diffObj).filter((value) => value < 0)
      .length
    return {
      text: isExpired ? 'Expired' : timeObjectToString(diffObj),
      color: diffObj.days < 1 ? 'error' : 'black',
    }
  }
}
</script>
