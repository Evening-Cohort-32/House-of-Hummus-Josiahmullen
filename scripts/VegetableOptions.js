import { getCollection } from './DataService.js'

export const VegetableOptions = async () => {
    const sizes = await getCollection('vegetables')

    return sizes.map(size => `
        <label class="option">
            <input type='radio' name='vegetable' value='${size.id}' /> <span>${size.carets}</span>
        </label>`).join('')
}
