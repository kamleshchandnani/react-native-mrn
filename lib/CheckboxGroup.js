import React, {
    Component,
    PropTypes,
} from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import Checkbox from './Checkbox';
import { THEME_NAME, COLOR_NAME } from './config';

/**
 * CheckboxGroup Component
 * @example
  <CheckboxGroup ref="CheckboxGroup1" name="group2" onSelect={(value) => {
                       }} primary={primary}>
      <Checkbox value="1" label="Checkbox On" checked={true}/>
      <Checkbox value="2" label="Checkbox Off"/>
      <Checkbox value="3" label="Checkbox On Disabled" checked={true} disabled={true}/>
      <Checkbox value="4" label="Checkbox Off Disabled" disabled={true}/>
      <Checkbox value="5" checked={true}/>
      <Checkbox value="6"/>
  </CheckboxGroup>
  <View style={[styles.content,styles.action]}>
      <Text style={{flex:1}}>Selected {this.state.group2Selected.join(',')}</Text>
      <Button raised={true} value="Press to select 1,2,6" onPress={()=>{this.refs.CheckboxGroup1.value = ['1','2','6']}} />
  </View>
 *
 */

class CheckboxGroup extends Component {
    /**
     * @param {object} props
     * @param {string} props.name - CheckboxGroup name. Often use in form
     * @param {enum(THEME_NAME)} [props.theme] - Checkbox theme option
     * @param {enum(COLOR_NAME)} [props.primary] - Checkbox primary color name. Specifies that which Checkbox should be pre-selected
     * @param {string[]} [props.value=[]] - A array save the values of checked Checkbox
     * @param {function(value:string)} [props.onSelect] - When CheckboxGroup value change will trigger this function
     *
     */
    constructor(props) {
        super(props);
        let options = React.Children.map(this.props.children, (option) => {
            let {
                value,
                checked
            } = option.props;

            if (checked) {
                /**
                 *
                 * @type {{selected: *[]}}
                 */
                this.state = {
                    selected: [...this.state.selected, value]
                };

                const { onSelect } = this.props;
                onSelect && onSelect(this.value);
            }
        })
    }

    static defaultProps = {
        value: []
    };
    static propTypes = {
        name: PropTypes.string.isRequired,
        theme: PropTypes.oneOf(THEME_NAME),
        primary: PropTypes.oneOf(COLOR_NAME),
        onSelect: PropTypes.func,
        value: PropTypes.array
    };
    state = {
        selected: []
    };

    render = () => {
        let options = React.Children.map(this.props.children, (option) => {
            let {
                value,
                label,
                disabled,
                ...other,
            } = option.props;
            let {
                name,
                theme,
                primary
            } = this.props;
            return <Checkbox
                {...other}
                ref={value}
                name={name}
                key={'Group' + value}
                value={value}
                label={label}
                theme={theme}
                primary={primary}
                disabled={disabled}
                onCheck={this._onChange}
                checked={this.state.selected && this.state.selected.indexOf(value) !== -1} />;
        }, this);

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {options}
            </View>
        );
    };

    _onChange = (checked, value) => {
        const { selected } = this.state;
        const { onSelect } = this.props;
        if (checked) {
            console.log('here');
            this.setState({
                selected: [...selected, value]
            }, () => {
                onSelect && onSelect(this.value);
            });
        } else {
            let index = selected.indexOf(value);
            console.log('index ', index);
            this.setState({
                selected: [
                    ...selected.slice(0, index),
                    ...selected.slice(index + 1)
                ]
            }, () => {
                onSelect && onSelect(this.value);
            });
        }

    };

    /**
     * Get the value of checked Checkbox in CheckboxGroup. Often use in form.
     * @returns {Array}
     */
    get value() {
        return this.state.selected
    }

    /**
     * Make CheckboxGroup set some checkbox checked
     * @param {string[]} value - An array of values of some Checkbox in　CheckboxGroup
     */
    set value(value) {
        this.setState({
            selected: value
        });

        const { onSelect } = this.props;
        onSelect && onSelect(this.value);
    }
}

const styles = StyleSheet.create({});
module.exports = CheckboxGroup;