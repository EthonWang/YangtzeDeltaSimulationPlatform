const data = [
  {
    type: 'problem',
    label: '问题1 ',
    children: [{
      type: "model",
      label: 'GCAM-CA',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }, {
      type: "model",
      label: 'TaiHu_Fvcom',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }]
  }, {
    type: 'problem',
    label: '问题2',
    children: [{
      type: "model",
      label: 'SEIMS',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }, {
      type: "model",
      label: 'DCBAH',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }]
  }, {
    label: '问题3',
    children: [{
      type: "model",
      label: 'SWMM',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }, {
      type: "model",
      label: 'SWAT',
      children: [{
        type: 'data',
        label: '数据1'
      }, {
        type: 'data',
        label: '数据2'
      }]
    }]
  }];
