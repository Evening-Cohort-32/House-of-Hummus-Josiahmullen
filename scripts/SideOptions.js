import { getCollection } from './DataService.js'

export const SideOptions = async () => {
    const styles = await getCollection('sides')

    return styles.map(style => `
        <label class="option">
            <input type='radio' name='side' value='${style.id}' /> <span>${style.style}</span>
        </label>`).join('')
}
