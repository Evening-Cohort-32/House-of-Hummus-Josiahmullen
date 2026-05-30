import { getCollection } from './DataService.js'

export const BaseDishOptions = async () => {
    const metals = await getCollection('baseDishes')

    const optionsHTML = metals.map(metal => `
        <label class="option">
            <input type='radio' name='baseDish' value='${metal.id}' /> <span>${metal.metal}</span>
        </label>`).join('')

    return optionsHTML
}
