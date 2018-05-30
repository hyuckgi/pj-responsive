import React  from 'react';
import { createForm } from 'rc-form';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { values } from '../../configs';

class SelectCountry extends React.Component {

    onChange(country){
        const { form } = this.props;
        form.setFieldsValue({country : country});
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <form>
                {getFieldDecorator('country', {
                })(
                    <Select
                        name="country"
                        placeholder="Select Country"
                        onChange={this.onChange.bind(this)}
                        options={values.countries}
                        searchable={false}
                    />
                )}
            </form>

        );
    }

}

export default createForm()(SelectCountry);
