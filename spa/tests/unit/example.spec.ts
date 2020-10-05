import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import AreaPopup from 'src/components/popups/Area.vue'

describe('AreaPopup.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(AreaPopup, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})
