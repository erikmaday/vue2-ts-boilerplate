/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid'

interface Filter {
  column: { _t_id: string }
  parent?: string
  method?: string
  topLevel?: boolean
}

export function filter(): any {
  let filterList: any[] = []

  // `f` is always the filter object

  function newParent(): Filter {
    return {
      column: {
        _t_id: uuidv4(),
      },
      parent: undefined,
    }
  }

  function createParent(method: string, childOf: Filter) {
    const parent = newParent()
    if (childOf) {
      parent.parent = childOf.column._t_id
    }
    parent.method = method
    filterList.push(parent)
    return parent
  }

  function filterById(b: Partial<Filter>) {
    return (a: Filter) => a.column._t_id === b?.column?._t_id
  }

  function find(f: Partial<Filter>) {
    return filterList.find(filterById(f))
  }

  function or(f: Filter, addToBeginning: boolean) {
    return andOr('or', f, addToBeginning)
  }

  function and(f: Filter, addToBeginning: boolean) {
    return andOr('and', f, addToBeginning)
  }

  function andOr(method: string, f: Filter, addToBeginning: boolean) {
    const exists = parent(f)
    const _parent = exists || newParent()
    if (!exists) {
      _parent.method = method
      if (addToBeginning) {
        _parent.topLevel = true
        filterList.unshift(_parent)
      } else {
        filterList.push(_parent)
      }
    }
    return {
      add: (f: { parent: any }) => add(_parent, f),
      addChild: (child: any, method: string) =>
        addChild(_parent, child, method),
    }
  }

  function add(parent: Filter, f: { parent: any }) {
    f.parent = parent.column._t_id
    const childExists = find(f)
    if (!childExists) {
      filterList.push(f)
    } else {
      console.warn(`Child already exists with id ${childExists.column._t_id}`)
    }
    return parent
  }

  function remove(f: Filter) {
    const _parent = parent(f)
    filterList = filterList.filter(
      (item) => item.column._t_id !== f.column._t_id
    )
    if (_parent) {
      const _children = children(_parent)
      const _childrenWithChildren = childrenWithChildren(_parent)
      if (_children.length === 0 && _childrenWithChildren.length === 0) {
        remove(_parent)
      }
    } else {
      console.warn(' No Parent')
    }
  }

  function children(f: Partial<Filter>) {
    return filterList.filter(
      (child) => child.parent === f?.column?._t_id && !child.method
    )
  }

  function childrenWithChildren(f: Partial<Filter>) {
    return filterList.filter(
      (child) => child.parent === f?.column?._t_id && child.method
    )
  }

  function addChild(parent: Filter, child: any, method: string) {
    const parentExists = find(parent)
    const childExists = find(child)
    if (!parentExists) {
      return console.error(
        `Error parent with ID ${parent.column._t_id} does not exist`
      )
    }
    if (childExists) {
      return console.error(
        `Error child with ID ${parent.column._t_id} already exists`
      )
    }
    const newChild = {
      parent: parent.column._t_id,
      method,
      ...child,
    }
    filterList.push(newChild)
    return {
      add: (f: { parent: any }) => add(newChild, f),
      addChild: (child: any, method: string) =>
        addChild(newChild, child, method),
    }
  }

  function parent(f: Partial<Filter>) {
    return filterList.find((p) => p.column._t_id === f.parent)
  }

  function parents() {
    return filterList.filter((f) => !f.parent)
  }

  function get() {
    return filterList
  }
  function set(rebuiltFilterList: any[]) {
    filterList = rebuiltFilterList
  }
  function clear() {
    filterList = []
  }
  function formatProp(p = '') {
    return p.replace(/\//g, '.')
  }

  function asQueryParams() {
    const queryParams = [['shortHand', '1']]
    const _parents = parents()
    const recurse = (_p: any[], _parentBase: string | undefined) => {
      // eslint-disable-next-line
      _p.forEach(
        (_parent: { topLevel: boolean; method: string }, _p_idx: any) => {
          let parentBase: string
          if (_parentBase) {
            parentBase = `${_parentBase}fs${_p_idx}` // eslint-disable-line
          } else {
            parentBase = _parent.topLevel ? `filter` : `filterfs${_p_idx}` // eslint-disable-line
          }
          const _children = children(_parent)
          queryParams.push([`${parentBase}l`, _parent.method])
          // eslint-disable-next-line
          _children.forEach((child, _c_idx) => {
            const addSingleFilter = (
              item: { column: { prop: string } },
              value: string,
              replacementProp: string | undefined,
              overrideIdx: number | undefined,
              overrideFilterType: undefined
            ) => {
              const childIdx = overrideIdx || _c_idx // eslint-disable-line
              queryParams.push([
                `${parentBase}fs${childIdx}fd`,
                formatProp(replacementProp || item.column.prop),
              ])
              queryParams.push([
                `${parentBase}fs${childIdx}op`,
                overrideFilterType || child.column.filterType,
              ])
              queryParams.push([`${parentBase}fs${childIdx}v`, value])
            }
            const { selectedPredefined } = child
            if (selectedPredefined) {
              const { controls = [] } = selectedPredefined
              queryParams[queryParams.length - 1][1] =
                selectedPredefined.childMethod ||
                child.column.childMethod ||
                'and'

              let predefinedCount = 0
              return controls.forEach(
                (control: {
                  value?: any
                  filterAsIs?: any
                  splitByProp?: any
                  filterType?: any
                  overrideProp?: any
                }) => {
                  if (
                    typeof control.value === 'undefined' ||
                    control.value === null
                  ) {
                    return
                  }
                  const { overrideProp } = control
                  const queryParts =
                    control.filterAsIs === true
                      ? [control.value]
                      : control.value.split(' ')
                  queryParts.forEach(
                    (queryPart: any, queryPartIndex: string | number) => {
                      if (Array.isArray(child.column.prop)) {
                        if (control.splitByProp) {
                          const prop = child.column.prop[queryPartIndex]
                          addSingleFilter(
                            child,
                            queryPart,
                            prop,
                            predefinedCount++,
                            control.filterType
                          )
                        } else {
                          child.column.prop.forEach((prop: string) =>
                            addSingleFilter(
                              child,
                              queryPart,
                              prop,
                              predefinedCount++,
                              control.filterType
                            )
                          )
                        }
                      } else {
                        addSingleFilter(
                          child,
                          queryPart,
                          overrideProp ||
                            child.column.filterProp ||
                            child.column.prop,
                          predefinedCount,
                          control.filterType
                        )
                        predefinedCount++
                      }
                    }
                  )
                }
              )
            }
            if (child.value === null || typeof child.value === 'undefined') {
              return
            }
            if (typeof child.value === 'string') {
              const queryParts =
                child.column.filterAsIs === true
                  ? [child.value]
                  : child.value.split(' ')
              if (queryParts.length > 1 || Array.isArray(child.column.prop)) {
                queryParams[queryParams.length - 1][1] = 'or'
              }
              let overrideIdx = 0
              queryParts.forEach((queryPart: any, partIndex: any) => {
                if (
                  child.column.filterProp &&
                  !Array.isArray(child.column.filterProp)
                ) {
                  addSingleFilter(
                    child,
                    queryPart,
                    child.column.filterProp,
                    partIndex,
                    undefined
                  )
                } else if (
                  Array.isArray(child.column.prop) ||
                  Array.isArray(child.column.filterProp)
                ) {
                  const propsArray =
                    child.column.filterProp || child.column.prop
                  propsArray.forEach((prop: string) =>
                    addSingleFilter(
                      child,
                      queryPart,
                      prop,
                      overrideIdx++,
                      undefined
                    )
                  )
                } else {
                  addSingleFilter(
                    child,
                    queryPart,
                    undefined,
                    partIndex,
                    undefined
                  )
                }
              })
            } else {
              addSingleFilter(
                child,
                child.value,
                undefined,
                undefined,
                undefined
              )
            }
          })
          const grandChildren = childrenWithChildren(_parent)
          if (grandChildren.length) {
            recurse(grandChildren, parentBase)
          }
        }
      )
    }
    recurse(_parents, undefined)
    return queryParams
      .filter((f) => f[0] !== null)
      .map((f) => `${f[0]}=${encodeURIComponent(f[1])}`)
      .join('&')
  }

  return {
    asQueryParams,
    createParent,
    parents,
    parent,
    remove,
    clear,
    find,
    get,
    set,
    or,
    and,
    add,
  }
}
