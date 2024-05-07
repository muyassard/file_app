import { CreateImage } from './../../modules/api';
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils';

import Single from '../Single.vue';
import { fileType, getFileType } from '@/util/fileType';
import { nextTick } from 'vue';


const max = 1024 * 1024 * 4;


describe('Single', () => {

    it("renders a file input", () => {
        const wrapper = mount(Single);
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find("input").html()).matchSnapshot()
    });

    it('renders file type based on file type correctly', async () => {
        const file = new File(["1200"], "fake.pdf", { type: "application/pdf" });
        const type = getFileType(file)
        expect(type).toBe(fileType.pdf)
    });

    it('displays an error message when selecting the wrong file type', async () => {
        const wrapper = mount(Single, {
            props: {
                maxSize: 2000000,
                type: 'zip',
            },
        });

        const inputElement = wrapper.find('input').element as HTMLInputElement;
        const file = new File(['2777'], 'foo.pdf', {
            type: 'application/pdf',
        });
        const mockFileList = Object.create(inputElement.files);
        mockFileList[0] = file;
        Object.defineProperty(mockFileList, 'length', { value: 1 });
        (wrapper.getCurrentComponent().exposed as unknown as any).singleChange({
            target: { files: mockFileList },
        });



        await nextTick();

        const errorMessage = wrapper.find('[error-message]')

        expect(errorMessage.exists()).toBe(true);
    });

    it('shows an error message when selecting a large file', async () => {
        const wrapper = mount(Single, {
            props: {
                maxSize: 2,
                type: 'pdf',
            },
        });

        const inputElement = wrapper.find('input').element as HTMLInputElement;
        const file = new File(['2777'], 'foo.pdf', {
            type: 'application/pdf',
        });
        const mockFileList = Object.create(inputElement.files);
        mockFileList[0] = file;
        Object.defineProperty(mockFileList, 'length', { value: 1 });
        (wrapper.getCurrentComponent().exposed as unknown as any).singleChange({
            target: { files: mockFileList },
        });



        await nextTick();

        const errorMessage = wrapper.find('[error-message]')

        expect(errorMessage.exists()).toBe(true);
    });

    // it('does not show an error message when loading the correct file type', async () => {
    //     const wrapper = mount(Single, {
    //         props: {
    //             maxSize: 4,
    //             type: 'zip',
    //         },
    //     });

    //     const input = wrapper.find('input');


    //     await input.trigger('change', {
    //         files: [{ type: 'application/zip', size:  }],
    //     });

    //     await nextTick();

    //     expect(wrapper.find('p[error-message]').exists()).toBe(false);
    // });


    it('api ', async () => {
        const wrapper = mount(Single, {
            props: {
                maxSize: 1000000,
                type: 'pdf',
            },
        });
        const data = 'Hello world';

        const file = new File([data], "fake.pdf", { type: "application/pdf" });

        await CreateImage(file);

        await nextTick();

        expect(wrapper.find('[error-message]').exists()).toBe(false);
    });

});














